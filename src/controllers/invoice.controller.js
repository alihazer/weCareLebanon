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

    // Constants
    const PAGE_WIDTH = 600;
    const PAGE_HEIGHT = 800;
    const BOTTOM_MARGIN = 50;

    // Fetch customer and product details
    const customer = await fetchCustomer(customerId);
    if (!customer) throw new Error('Customer not found');
    const productIds = products.map((p) => p.productId);
    const allProducts = await fetchProducts(productIds);
    if (!allProducts?.length) throw new Error('No products found');

    // Load Arabic-supported font
    const arabicFontBytes = await fs.readFile('src/utils/font/Amiri-Regular.ttf');

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const arabicFont = await pdfDoc.embedFont(arabicFontBytes);
    const bidi = bidiFactory();

    let currentPage;
    let currentY;

    // Function to add a new page and reset Y position
    const addNewPage = () => {
      currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      currentY = PAGE_HEIGHT - 50; // Initial Y position after top margin
    };

    // Function to draw table headers with vertical lines
    const drawTableHeader = () => {
      const colWidths = [200, 80, 80, 80];
      const tableHeaderHeight = 20;

      // Header background
      currentPage.drawRectangle({
        x: 50,
        y: currentY,
        width: colWidths.reduce((a, b) => a + b, 0),
        height: tableHeaderHeight,
        color: rgb(0.8, 0.8, 0.8),
      });

      // Header text
      currentPage.drawText('Product', { x: 50, y: currentY + 5, size: 12 });
      currentPage.drawText('Quantity', { x: 50 + colWidths[0], y: currentY + 5, size: 12 });
      currentPage.drawText('Price', { x: 50 + colWidths[0] + colWidths[1], y: currentY + 5, size: 12 });
      currentPage.drawText('Total', { x: 50 + colWidths[0] + colWidths[1] + colWidths[2], y: currentY + 5, size: 12 });

      // Vertical lines for columns
      let xPos = 30;
      for (const width of colWidths) {
        xPos += width;
        currentPage.drawLine({
          start: { x: xPos, y: currentY },
          end: { x: xPos, y: currentY - tableHeaderHeight },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }

      currentY -= tableHeaderHeight;
    };

    // Initialize first page
    addNewPage();

    // Add logo
    if (logoUrl) {
      const logoImageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const logoDims = logoImage.scale(0.3);
      currentPage.drawImage(logoImage, {
        x: 20,
        y: currentY - 80,
        width: logoDims.width,
        height: logoDims.height,
      });
    }

    // Process customer address
    const reshapedAddress = ArabicReshaper.convertArabic(customer.address);
    const embeddingLevels = bidi.getEmbeddingLevels(reshapedAddress);
    const flips = bidi.getReorderSegments(reshapedAddress, embeddingLevels);
    let reorderedText = '';
    flips.forEach(([start, end]) => {
      reorderedText += reshapedAddress.slice(start, end + 1).split('').reverse().join('');
    });

    // Invoice Header
    currentPage.drawText('INVOICE', { x: 250, y: currentY - 20, size: 24, color: rgb(0.2, 0.4, 0.6) });
    currentPage.drawText(`#${invoiceNumber}`, { x: 280, y: currentY - 40, size: 15 });
    currentY -= 120;

    // Customer Details
    currentPage.drawText(`Customer Name: ${customer.name}`, { x: 50, y: currentY, size: 12, font: arabicFont });
    currentPage.drawText(`DATE: ${new Date().toLocaleDateString()}`, { x: 450, y: currentY, size: 12 });
    currentY -= 20;
    currentPage.drawText(`Phone Number: ${customer.phone}`, { x: 50, y: currentY, size: 12, font: arabicFont });
    currentY -= 20;
    currentPage.drawText(`Address: ${reorderedText}`, { x: 50, y: currentY, size: 12, font: arabicFont });
    currentY -= 40;

    // Draw initial table header
    drawTableHeader();

    // Process products
    let totalPrice = 0;
    for (const product of allProducts) {
      const productDetails = products.find((p) => p.productId.toString() === product._id.toString());
      const unitPrice = productDetails.isWholeSale ? product.wholeSalePrice : product.singlePrice;
      const productTotal = productDetails.quantity * unitPrice;
      totalPrice += productTotal;
      const note = productDetails.note || '';

      // Calculate row height
      const lineHeight = 12;
      const rowHeight = lineHeight + 5;

      // Check if new page is needed
      if (currentY - rowHeight < BOTTOM_MARGIN) {
        addNewPage();
        drawTableHeader();
      }

      // Draw product name and note
      currentPage.drawText(product.name, {
        x: 50,
        y: currentY,
        size: 10,
        font: arabicFont,
        maxWidth: 200 * 0.5,
      });

      if (note) {
        currentPage.drawText(`(${note} )`, {
          x: 50 + 70,
          y: currentY,
          size: 8,
          font: arabicFont,
          color: rgb(0.5, 0.5, 0.5),
          maxWidth: 200 * 0.5,
        });
      }

      // Draw other columns
      currentPage.drawText(productDetails.quantity.toString(), { x: 250, y: currentY, size: 10 });
      currentPage.drawText(`$${unitPrice.toFixed(2)}`, { x: 330, y: currentY, size: 10 });
      currentPage.drawText(`$${productTotal.toFixed(2)}`, { x: 410, y: currentY, size: 10 });

      // Vertical lines for product rows
      const colWidths = [200, 80, 80, 80];
      let xPos = 30;
      for (const width of colWidths) {
        xPos += width;
        currentPage.drawLine({
          start: { x: xPos, y: currentY + 5 },
          end: { x: xPos, y: currentY - rowHeight + 5 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }

      currentY -= rowHeight - 5;
    }

    // Check space for totals (3 lines @ 20 each + footer)
    if (currentY - 60 < BOTTOM_MARGIN) {
      addNewPage();
    }

    // Draw totals
    const discountAmount = totalPrice * (discount / 100);
    currentY -= 40;
    currentPage.drawText(`Subtotal: $${totalPrice.toFixed(2)}`, { x: 350, y: currentY, size: 12 });
    currentY -= 20;
    currentPage.drawText(`Discount (${discount}%): -$${discountAmount.toFixed(2)}`, { x: 350, y: currentY, size: 12 });
    currentY -= 20;
    currentPage.drawText(`Total: $${total.toFixed(2)}`, { x: 350, y: currentY, size: 14, color: rgb(1, 0, 0) });
    currentY -= 20;

    // Ensure footer is on last page
    if (currentY < BOTTOM_MARGIN) {
      addNewPage();
    }
    currentPage.drawText('Ansar, Nabatieh, Lebanon | Phone:+961 76920892  | Email: aboualijomaa@gmail.com', {
      x: 40,
      y: 50,
      size: 13,
    });

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
