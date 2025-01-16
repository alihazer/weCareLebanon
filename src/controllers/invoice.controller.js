import asyncHandler from 'express-async-handler';
import Invoice from '../models/invoice.model.js';
import { PDFDocument, rgb } from 'pdf-lib';
import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js';

// @desc    Create a new invoice
// @route   POST /api/invoices

const createInvoice = asyncHandler(async (req, res) => {

  try {
    const { products, customerId, discount, isWholeSale } = req.body;

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
    const totalPriceWithDiscount = calculateTotal(products, discount);
    const invoice = new Invoice({
      products,
      customerId,
      discount,
      total: totalPriceWithDiscount,
      isWholeSale,
    });

    await invoice.save();
        
    for (const product of products) { 
      await Product.findByIdAndUpdate(product.productId, { $inc: { quantity: -product.quantity } });
    }
    await createAndDownloadInvoice(invoice, "/logo.png");
    res.status(201).json(invoice);
  } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

const calculateTotal = (products, discount) => {
    let total = 0;
    for (const product of products) {
      total += (product.quantity * product.price);
    }
    return total - (total * discount / 100);
};

async function createAndDownloadInvoice(invoice, logoUrl) {
    try {
      const {
        invoiceId,
        customerId, 
        products, 
        discount,
        total,
      } = invoice;
  
      // Fetch customer details using customerId
      const customer = await fetchCustomer(customerId); // Replace with your actual data fetching logic
      if (!customer) {
        throw new Error('Customer not found');
      }
  
      // Fetch product details using productIds
      const productss = await fetchProducts(productIds); // Replace with your actual data fetching logic
      if (!products || products.length === 0) {
        throw new Error('No products found');
      }
  
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]); // Dimensions: width, height
  
      // Add logo
      if (logoUrl) {
        const logoImageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        const logoDims = logoImage.scale(0.5);
        page.drawImage(logoImage, {
          x: 50,
          y: 720,
          width: logoDims.width,
          height: logoDims.height,
        });
      }
  
      // Add invoice details
      page.drawText('INVOICE', { x: 250, y: 720, size: 20, color: rgb(0, 0, 1) });
      page.drawText(`Invoice ID: ${invoiceId}`, { x: 50, y: 680, size: 12 });
      page.drawText(`Customer Name: ${customer.name}`, { x: 50, y: 660, size: 12 });
      page.drawText(`Phone Number: ${customer.phone}`, { x: 50, y: 640, size: 12 });
  
      // Add table header
      page.drawText('Product', { x: 50, y: 600, size: 12 });
      page.drawText('Quantity', { x: 200, y: 600, size: 12 });
      page.drawText('Price', { x: 300, y: 600, size: 12 });
      page.drawText('Total', { x: 400, y: 600, size: 12 });
  
      // Add products
      let yPosition = 580;
      for (const product of productss) {
        const product = productss.find(p => p.id === products);
        if (product) {
          page.drawText(product.name, { x: 50, y: yPosition, size: 12 });
          page.drawText(product.quantity.toString(), { x: 200, y: yPosition, size: 12 });
          page.drawText(`$${product.price.toFixed(2)}`, { x: 300, y: yPosition, size: 12 });
          page.drawText(`$${(product.quantity * product.price).toFixed(2)}`, { x: 400, y: yPosition, size: 12 });
          yPosition -= 20;
        }
      }
  
      // Add totals and discount
      const discountAmount = (total * discount) / 100;
      const discountedTotal = total - discountAmount;
      yPosition -= 20;
      page.drawText(`Subtotal: $${total.toFixed(2)}`, {
        x: 300,
        y: yPosition,
        size: 12,
      });
      yPosition -= 20;
      page.drawText(`Discount (${discount}%): -$${discountAmount.toFixed(2)}`, {
        x: 300,
        y: yPosition,
        size: 12,
      });
      yPosition -= 20;
      page.drawText(`Total: $${discountedTotal.toFixed(2)}`, {
        x: 300,
        y: yPosition,
        size: 14,
        color: rgb(1, 0, 0),
      });
  
      // Serialize the PDF document
      const pdfBytes = await pdfDoc.save();
  
      // Enforce download in the browser
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'invoice.pdf';
      link.click();
    } catch (error) {
      console.error('Error creating invoice:', error.message);
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