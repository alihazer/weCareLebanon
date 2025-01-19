import asyncHandler from 'express-async-handler';
import Invoice from '../models/invoice.model.js';
import { PDFDocument, rgb } from 'pdf-lib';
import fetch from 'node-fetch';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

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

    const  totalPriceWithDiscount =await calculateTotal(products, discount);
    const invoice = new Invoice({
      products,
      customerId,
      discount,
      total: totalPriceWithDiscount,
    });

    await invoice.save();
        
    for (const product of products) { 
      await Product.findByIdAndUpdate(product.productId, { $inc: { quantity: -product.quantity } });
    }
    const logo = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_GX_c-BdJjgmFkmrmmRcgzP6D0FgIXivV0v3onTZr8Xke3tAElO1glvmNJBW7l_5WPCiKUSh2_G-3MD5ly0EL3PgvWTZZ_MoDPHijg1A8wlrJvX9UV52ETa47N73LLokZdtkWWEfZtlrql9UT3ze3CRud4HI0Rx7OZOOR4AqcFzEw9SO3q85ZuRSjJCQ/s800/Untitled-2.png"
    const pdfBytes = await createAndDownloadInvoice(invoice, logo, products[0].isWholeSale);
    if(!pdfBytes) {
      return res.status(500).json({ message: 'Failed to create invoice.' });
    }
    
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');

    res.status(201).json({
      message: "Order created successfully!",
      data: invoice,
      pdfBytes: Buffer.from(pdfBytes).toString('base64')
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




async function createAndDownloadInvoice(invoice, logoUrl, isWholeSale) {
  try {
    const { _id, customerId, products, discount, total } = invoice;

    // Fetch customer and product details
    const customer = await fetchCustomer(customerId);
    if (!customer) throw new Error('Customer not found');
    const productIds = products.map(p => p.productId);
    const allProducts = await fetchProducts(productIds);
    if (!allProducts || allProducts.length === 0) throw new Error('No products found');

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]); // Standard page size
    let yPosition = 750; // Start near the top

    // Add logo
    if (logoUrl) {
      const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const logoDims = logoImage.scale(0.5);
      page.drawImage(logoImage, { x: 80, y: yPosition - 50, width: logoDims.width, height: logoDims.height });
    }

    // Invoice Header
    page.drawText('INVOICE', { x: 260, y: yPosition - 73, size: 24, color: rgb(0.2, 0.4, 0.6) });
    yPosition -= 100;
    page.drawText(`Invoice ID: ${_id}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 20;
    page.drawText(`Customer Name: ${customer.name}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 20;
    page.drawText(`Phone Number: ${customer.phone}`, { x: 50, y: yPosition, size: 12 });
    yPosition -= 40;

    // Table Header
    page.drawText('Product', { x: 50, y: yPosition, size: 12 });
    page.drawText('Quantity', { x: 250, y: yPosition, size: 12 });
    page.drawText('Price', { x: 350, y: yPosition, size: 12 });
    page.drawText('Total', { x: 450, y: yPosition, size: 12 });
    yPosition -= 20;

    // Product Rows
    for (const product of allProducts) {
      const productDetails = products.find(p => p.productId.toString() === product._id.toString());
      const unitPrice = isWholeSale ? product.wholeSalePrice : product.singlePrice;
      const productTotal = productDetails.quantity * unitPrice;
      page.drawText(product.name, { x: 50, y: yPosition, size: 10 });
      page.drawText(productDetails.quantity.toString(), { x: 250, y: yPosition, size: 10 });
      page.drawText(`$${unitPrice.toFixed(2)}`, { x: 350, y: yPosition, size: 10 });
      page.drawText(`$${productTotal.toFixed(2)}`, { x: 450, y: yPosition, size: 10 });
      yPosition -= 10;
    }

    // Totals
    yPosition -= 20;
    const discountAmount = (total * discount) / 100;
    const unDiscountedTotal = total + discountAmount;

    page.drawText(`Subtotal: $${unDiscountedTotal.toFixed(2)}`, { x: 350, y: yPosition, size: 12 });
    yPosition -= 20;
    page.drawText(`Discount (${discount}%): -$${discountAmount.toFixed(2)}`, { x: 350, y: yPosition, size: 12 });
    yPosition -= 20;
    page.drawText(`Total: $${total.toFixed(2)}`, { x: 350, y: yPosition, size: 14, color: rgb(1, 0, 0) });

    const footerYPosition = 50; 
    page.drawText('Ansar, Nabatieh', { x: 230, y: footerYPosition, size: 15 });
    page.drawText('Phone: +961 76920892', { x: 215, y: footerYPosition - 15, size: 15 });
    page.drawText('email@email.com', { x: 230, y: footerYPosition - 30, size: 15 });

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


export {createInvoice};
