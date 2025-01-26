import asyncHandler from 'express-async-handler';
import Invoice from '../models/invoice.model.js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fetch from 'node-fetch';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';
import fs from 'fs/promises';
import fontkit from '@pdf-lib/fontkit';
import ArabicReshaper from 'arabic-reshaper';
import bidiFactory from 'bidi-js'
import Profit from '../models/profit.model.js';



// @desc    Create a new invoice
// @route   POST /api/invoices

const createInvoice = asyncHandler(async (req, res) => {

  try {
    const { products, customerId, discount } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'Products array cannot be empty.' });
    }

    for (const product of products) {
      if (!product.productId || !product.quantity || !product.price) {
            return res.status(400).json({ error: 'Each product must have productId, quantity, and price.' });
        }
    }

    if(discount < 0 || discount > 100) {
      return res.status(400).json({ error: 'Discount must be between 0 and 100.' });
    }

    const  totalPriceWithDiscount = await calculateTotal(products, discount);
    const invoice = new Invoice({
      products,
      customerId,
      discount,
      total: totalPriceWithDiscount,
    });


    await invoice.save();

    const discountAmmount = totalPriceWithDiscount * (discount / 100);
    const totalProfit = await calculateProductProfit(products, discountAmmount);
    // Save profit
    const profit = new Profit({
      invoiceId: invoice._id,
      totalProfit,
    })
    await profit.save();
        
    for (const product of products) { 
      await Product.findByIdAndUpdate(product.productId, { $inc: { quantity: -product.quantity } });
    }
    const logo = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7k4y5SSYQvLYQkiXVjPHn4ueVgaICSkzRzPGqB7rb0XrQme9c_mN_JJy49nB7cfvVVLrOMnARiXsg4CPczlBIO1JM5pvC7gtJtzl8RhGxii9T8rimBr_4M7bHu5FADWP8NDYuxWqRPUHJOB1zRwmDpj8No6-tmrP0TSzuzZQcmw_CzeSB0RGrRq7x5S0/s400/Untitled-adad1.png"
    const pdfBytes = await createAndDownloadInvoice(invoice, logo);
    const customer = await Customer.findById(customerId);
    if(!pdfBytes) {
      return res.status(500).json({
        status: false,
        message: "Error creating invoice"
      });
    }
    
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');

    res.status(201).json({
      message: "Order created successfully!",
      data: invoice,
      pdfBytes: Buffer.from(pdfBytes).toString('base64'),
      customerName: customer.name,
  });
  } catch (error) {
      res.status(500).json({ error: error.message });
    }
});



const calculateTotal = async (products, discount) => {
  try {
      let total = 0;
      for (const product of products) {
        const allProducts =  await Product.findById(product.productId.toString());;
          if (product.isWholeSale) {
              total += (product.quantity * allProducts.wholeSalePrice);
          } else {
              total += (product.quantity * allProducts.singlePrice);
          }
      }

      return total - (total * discount / 100);
  } catch (error) {
      console.error("Error calculating total:", error);
      throw new Error("Failed to calculate total.");
  }
};



async function createAndDownloadInvoice(invoice, logoUrl) {
  try {
    const { _id, customerId, products, discount, total, invoiceNumber } = invoice;

    // Fetch customer and product details
    const customer = await fetchCustomer(customerId);
    if (!customer) throw new Error('Customer not found');
    const productIds = products.map((p) => p.productId);
    const allProducts = await fetchProducts(productIds);
    if (!allProducts || allProducts.length === 0) throw new Error('No products found');

    // Load Arabic-supported font
    const arabicFontBytes = await fs.readFile('src/utils/font/Amiri-Regular.ttf');

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit); // Register fontkit
    const arabicFont = await pdfDoc.embedFont(arabicFontBytes);
    const page = pdfDoc.addPage([600, 800]);
    const bidi = bidiFactory();
    let yPosition = 750;

    // Add logo
    if (logoUrl) {
      const logoImageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const logoDims = logoImage.scale(0.5);
      page.drawImage(logoImage, { x: 0, y: yPosition - 120, width: logoDims.width, height: logoDims.height });
    }

    // Reshape the Arabic text
    const reshaperCustomerAddress = ArabicReshaper.convertArabic(customer.address);

    // Get the embedding levels for bidirectional text
    const embeddingLevels = bidi.getEmbeddingLevels(reshaperCustomerAddress);

    // Get the reorder segments
    const flips = bidi.getReorderSegments(
      reshaperCustomerAddress, // the reshaped input string
      embeddingLevels          // the result object from getEmbeddingLevels
    );

    // Rebuild the text with correct order
    let reorderedText = '';
    flips.forEach(range => {
      const [start, end] = range;

      // Extract the range and reverse it for RTL
      const segment = reshaperCustomerAddress.slice(start, end + 1);
      reorderedText += segment.split('').reverse().join('');
    });

    // Invoice Header
    page.drawText('INVOICE', { x: 250, y: yPosition - 65, size: 24, color: rgb(0.2, 0.4, 0.6) });
    page.drawText(`#${invoiceNumber}`, { x: 285, y: yPosition - 80, size: 15 });
    yPosition -= 120;
    page.drawText(`Customer Name: ${customer.name}`, { x: 50, y: yPosition, size: 12, font: arabicFont });
    page.drawText(`DATE: ${new Date().toLocaleDateString()}`, { x: 450, y: yPosition, size: 12 });
    yPosition -= 20;
    page.drawText(`Phone Number: ${customer.phone}`, { x: 50, y: yPosition, size: 12, font: arabicFont });
    yPosition -= 20;
    page.drawText(`Address: ${reorderedText}`, { x: 50, y: yPosition, size: 12, font: arabicFont });
    yPosition -= 40;

    // Table Header with gray background and vertical lines
    const colWidths = [150, 100, 100, 100]; // Set fixed column widths
    const tableHeaderHeight = 20;
    const tableHeight = allProducts.length * 10 + tableHeaderHeight; // Calculate height based on the number of products

    // Draw gray background for header row
    page.drawRectangle({
      x: 50,
      y: yPosition,
      width: colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
      height: tableHeaderHeight,
      color: rgb(0.8, 0.8, 0.8), // Gray color
    });

    // Draw Table Header text
    page.drawText('  Product', { x: 50, y: yPosition + 5, size: 12 });
    page.drawText('Quantity', { x: 50 + colWidths[0], y: yPosition + 5, size: 12 });
    page.drawText('Price', { x: 50 + colWidths[0] + colWidths[1], y: yPosition + 5, size: 12 });
    page.drawText('Total', { x: 50 + colWidths[0] + colWidths[1] + colWidths[2], y: yPosition + 5, size: 12 });

    // Draw vertical lines for each column
    page.drawRectangle({ x: 20 + colWidths[0], y: yPosition - 10, width: 0, height: tableHeaderHeight + 10, color: rgb(0, 0, 0) }); // Line 1
    page.drawRectangle({ x: 20 + colWidths[0] + colWidths[1], y: yPosition - 10, width: 0, height: tableHeaderHeight + 10, color: rgb(0, 0, 0) }); // Line 2
    page.drawRectangle({ x: 20 + colWidths[0] + colWidths[1] + colWidths[2], y: yPosition - 10, width: 0, height: tableHeaderHeight + 10, color: rgb(0, 0, 0) }); // Line 3

    yPosition -= tableHeaderHeight;

    let totalPrice = 0;

    // Product Rows
    for (const product of allProducts) {
      const productDetails = products.find((p) => p.productId.toString() === product._id.toString());
      const unitPrice = productDetails.isWholeSale ? product.wholeSalePrice : product.singlePrice;
      const productTotal = productDetails.quantity * unitPrice;
      totalPrice += productTotal;

      // Draw Product Rows
      page.drawText(`  ${product.name}`, { x: 50, y: yPosition, size: 10, font: arabicFont });
      page.drawText(`  ${productDetails.quantity.toString()}`, { x: 50 + colWidths[0], y: yPosition, size: 10 });
      page.drawText(`  $${unitPrice.toFixed(2)}`, { x: 50 + colWidths[0] + colWidths[1], y: yPosition, size: 10 });
      page.drawText(`  $${productTotal.toFixed(2)}`, { x: 50 + colWidths[0] + colWidths[1] + colWidths[2], y: yPosition, size: 10 });

      // Draw vertical lines between columns for product rows
      page.drawRectangle({ x: 20 + colWidths[0], y: yPosition, width: 0, height: 10, color: rgb(0, 0, 0) }); // Line 1
      page.drawRectangle({ x: 20 + colWidths[0] + colWidths[1], y: yPosition, width: 0, height: 10, color: rgb(0, 0, 0) }); // Line 2
      page.drawRectangle({ x: 20 + colWidths[0] + colWidths[1] + colWidths[2], y: yPosition, width: 0, height: 10, color: rgb(0, 0, 0) }); // Line 3

      yPosition -= 10;
    }

    // Totals
    yPosition -= 20;
    const discountAmount = totalPrice * (discount / 100);

    page.drawText(`Subtotal: $${totalPrice.toFixed(2)}`, { x: 350, y: yPosition, size: 12 });
    yPosition -= 20;
    page.drawText(`Discount (${discount}%): -$${discountAmount.toFixed(2)}`, { x: 350, y: yPosition, size: 12 });
    yPosition -= 20;
    page.drawText(`Total: $${total.toFixed(2)}`, { x: 350, y: yPosition, size: 14, color: rgb(1, 0, 0) });

    // Footer
    const footerYPosition = 50;
    page.drawText('Ansar, Nabatieh', { x: 230, y: footerYPosition, size: 15, font: arabicFont });
    page.drawText('Phone: +961 76920892', { x: 215, y: footerYPosition - 15, size: 15, font: arabicFont });
    page.drawText('aboualijomaa@gmail.com', { x: 230, y: footerYPosition - 30, size: 15, font: arabicFont });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error creating invoice:', error);
    return null;
  }
}


  

const fetchCustomer = async (customerId) => {
    const customer = await Customer.findById(customerId);
    return customer;
}

const fetchProducts = async (productIds) => {
    const products = await Product.find({ _id: { $in: productIds } });
    return products;
}

const calculateProductProfit = async (products, discountAmmount) => {
  const allProducts = await Product.find({ _id: { $in: products.map((p) => p.productId) } });
  let totalProfit = 0;
  for (const product of products) {
    const productDetails = allProducts.find((p) => p._id.toString() === product.productId.toString());
    const unitProfit = product.isWholeSale ? productDetails.wholeSalePrice - productDetails.purchasePrice : productDetails.singlePrice - productDetails.purchasePrice;

    totalProfit += unitProfit * product.quantity;
  }

  const profitWithDiscount = totalProfit - discountAmmount;
  console.log('Total Profit:', profitWithDiscount);
  return profitWithDiscount;
}



const getCustomerInvoices = asyncHandler(async (req, res) => {
  try {
    const customerId = req.params.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let filter = { customerId };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const parsedStartDate = new Date(startDate);
        if (isNaN(parsedStartDate)) {
          return res.status(400).json({ status: false, message: "Invalid startDate" });
        }
        filter.createdAt.$gte = parsedStartDate;
      }
      if (endDate) {
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedEndDate)) {
          return res.status(400).json({ status: false, message: "Invalid endDate" });
        }
        filter.createdAt.$lte = parsedEndDate;
      }
    }


    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "products.productId", 
        select: "name price description", 
      })

    const enrichedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        const profit = await Profit.findOne({ invoiceId: invoice._id });
        return {
          ...invoice.toObject(), 
          profit: profit ? profit.totalProfit : null, 
        };
      })
    );

    return res.status(200).json({
      status: true,
      data: enrichedInvoices,
      count: enrichedInvoices.length,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});



const getAllInvoices = asyncHandler(async (req, res) => {
  try {
    const invoices = await Invoice.find().populate({
      path: "products.productId", 
      select: "name price description", 
    }).sort({ createdAt: -1 });
    const enrichedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        const profit = await Profit.findOne({ invoiceId: invoice._id });
        return {
          ...invoice.toObject(), 
          profit: profit ? profit.totalProfit : null, 
        };
      })
    );

    return res.status(200).json({
      status: true,
      data: enrichedInvoices,
      count: enrichedInvoices.length
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});



export {createInvoice, getCustomerInvoices, getAllInvoices};
