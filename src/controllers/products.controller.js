import Product from '../models/product.model.js';
import asyncHandler from 'express-async-handler';
import { v2 as cloudinary } from 'cloudinary';
import Invoice from '../models/invoice.model.js';
import mongoose from 'mongoose';
import  { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';



// @desc get all products
const getProducts = asyncHandler(async (req, res) => {
    try {
        const { category,supplier,from, to,search } = req.query;
        
        let filter = {};
        if (category) {
            filter.category_id = category;
        }
        if (supplier) {
            filter.supplierId = supplier;
        }
        if (req.query.quantity === 'gt0') {
            filter.quantity = { $gt: 0 };
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' }; 
        }        
        if (from || to) {
            filter.createdAt = {};
        
            if (from) {
                filter.createdAt.$gte = new Date(from);
            }
            if (to) {
                filter.createdAt.$lte = new Date(to); 
            }
        }


        const products = await Product.find(filter).populate('supplierId', 'name').sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            data: products
        });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// @desc get single product
const getProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('supplierId', 'name');
        if(!product){
            res.status(404);
            throw new Error("Product not found");
        }
        return res.status(200).json({
            status: true,
            data: product
        });
    } catch (error) {
        
    }
});

// @desc add product
const createProduct = asyncHandler(async (req, res) => {
    const { name, category_id, code, details, purchasePrice, wholeSalePrice, singlePrice, supplierId, quantity, image } = req.body;
    cloudinary.config({
        cloud_name: process.env.cloudinary_cloud_name,
        api_key: process.env.cloudinary_api_key,
        api_secret: process.env.cloudinary_api_secret,
    });

    const uploadFromBuffer = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
  
      const result = await uploadFromBuffer(req.file.buffer);

    
    try {
        const newProduct = new Product({
            name,
            category_id,
            code,
            details,
            purchasePrice,
            wholeSalePrice,
            singlePrice,
            supplierId,
            quantity,
            image: result.secure_url,
        });
  
      await newProduct.save();
  
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
    });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500);
        throw new Error(error.message);
    }
});

const editProduct = asyncHandler(async (req, res) => {
    const { name, category_id, code, details, purchasePrice, wholeSalePrice, singlePrice, supplierId, quantity } = req.body;
    

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error("Product not found");
        }

        product.name = name;
        product.category_id = category_id;
        product.code = code;
        product.details = details;
        product.purchasePrice = purchasePrice;
        product.wholeSalePrice = wholeSalePrice;
        product.singlePrice = singlePrice;
        product.supplierId = supplierId;
        product.quantity = quantity;

        if (req.file) {
            cloudinary.config({
                cloud_name: process.env.cloudinary_cloud_name,
                api_key: process.env.cloudinary_api_key,
                api_secret: process.env.cloudinary_api_secret,
            });

            const uploadFromBuffer = (buffer) =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'products' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(buffer);
                });

            const result = await uploadFromBuffer(req.file.buffer);
            product.image = result.secure_url;
        }

        await product.save();

        res.status(200).json({
            status: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        res.status(500).json({
            message: "An error occurred while updating the product",
            error: error.message,
        });
        console.log(error);
    }
});


const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product){
            res.status(404);
            throw new Error("Product not found");
        }
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the product",
            error: error.message,
        });
    }
});

const getProductStats = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const year = parseInt(req.query.startDate) || new Date().getFullYear();

    try {
        const stats = await Invoice.aggregate([
            {
                $match: {
                    "products.productId": new mongoose.Types.ObjectId(productId),
                    createdAt: {
                        $gte: new Date(year, 0, 1), 
                        $lte: new Date(year, 11, 31, 23, 59, 59), 
                    },
                },
            },
            { $unwind: "$products" },
            {
                $match: {
                    "products.productId": new mongoose.Types.ObjectId(productId),
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalQuantity: { $sum: "$products.quantity" },
                },
            },
            { $sort: { "_id": 1 } }, 
        ]);


        const allMonths = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            totalQuantity: 0,
        }));


        stats.forEach(stat => {
            const monthIndex = stat._id - 1; 
            allMonths[monthIndex].totalQuantity = stat.totalQuantity;
        });

 
        res.status(200).json({
            status: true,
            data: allMonths,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching product stats",
            error: error.message
        });
    }
});

const createQuotation = asyncHandler(async (req, res) => {
    let { selectedProducts, isWholeSale } = req.body;

    try {
        selectedProducts = selectedProducts.split(',');
        const products = await Product.find({ _id: { $in: selectedProducts } });

        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]); // Set page size (width, height)
        const { width, height } = page.getSize();

        // Set up fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        const lineHeight = 15;

        // Add company logo (top-left corner)
        const logoUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7k4y5SSYQvLYQkiXVjPHn4ueVgaICSkzRzPGqB7rb0XrQme9c_mN_JJy49nB7cfvVVLrOMnARiXsg4CPczlBIO1JM5pvC7gtJtzl8RhGxii9T8rimBr_4M7bHu5FADWP8NDYuxWqRPUHJOB1zRwmDpj8No6-tmrP0TSzuzZQcmw_CzeSB0RGrRq7x5S0/s400/Untitled-adad1.png';
        const logoResponse = await fetch(logoUrl);
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBuffer); 
        const logoDims = logoImage.scale(0.3); 
        page.drawImage(logoImage, {
            x: 50, 
            y: height - 50 - logoDims.height, 
            width: logoDims.width,
            height: logoDims.height,
        });

        const currentDate = new Date().toLocaleDateString();
        const dateWidth = font.widthOfTextAtSize(currentDate, fontSize);
        page.drawText(currentDate, {
            x: width - 50 - dateWidth,
            y: height - 110,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        let y = height - 100 - logoDims.height; 
        page.drawText('Quotation', {
            x: 50,
            y,
            size: 20,
            font,
            color: rgb(0, 0, 0),
        });
        y -= lineHeight * 2; 

        // Define column headers and widths
        const headers = ['Image', 'Name', 'Details', 'Price'];
        const columnWidths = [100, 150, 200]; 

        // Draw headers
        headers.forEach((header, index) => {
            page.drawText(header, {
                x: 50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });
        });

        // Add vertical lines between columns
        let xPosition = 40;
        columnWidths.forEach((width) => {
            xPosition += width;
            page.drawLine({
                start: { x: xPosition, y: y + (lineHeight - 30) }, // Start from below the header
                end: { x: xPosition, y: 50 }, // End at the footer margin
                thickness: 1,
                color: rgb(0, 0, 0),
            });
        });

        y -= lineHeight * 4; 

        const imageWidth = 80; 
        const imageHeight = 80; 

        for (const product of products) {
            if (y < 150) { 
                page = pdfDoc.addPage([600, 800]); 
                y = height - 50; 

                headers.forEach((header, index) => {
                    page.drawText(header, {
                        x: 50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
                        y,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });
                });

                xPosition = 40;
                columnWidths.forEach((width) => {
                    xPosition += width;
                    page.drawLine({
                        start: { x: xPosition, y: y + (lineHeight - 15) },
                        end: { x: xPosition, y: 50 },
                        thickness: 1,
                        color: rgb(0, 0, 0),
                    });
                });

                y -= lineHeight * 4; 
            }

            if (product.image) {
                try {
                    const imageResponse = await fetch(product.image);
                    const imageBuffer = await imageResponse.arrayBuffer();

                    const imageUrl = product.image.toLowerCase();
                    let image;
                    if (imageUrl.endsWith('.png')) {
                        image = await pdfDoc.embedPng(imageBuffer); 
                    } else if (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg')) {
                        image = await pdfDoc.embedJpg(imageBuffer); 
                    } else {
                        console.error('Unsupported image format:', product.image);
                        continue; 
                    }

                    const imageDims = image.scaleToFit(imageWidth, imageHeight);

                    page.drawImage(image, {
                        x: 50, 
                        y: y - imageHeight + 40,
                        width: imageDims.width,
                        height: imageDims.height,
                    });
                } catch (error) {
                    console.error('Error embedding image:', error);
                }
            }

            page.drawText(product.name, {
                x: 150, 
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });
            const productDescription = product.details || 'No description';
            page.drawText(productDescription, {
                x: 300, 
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });

            page.drawText(`$${isWholeSale ? product.wholeSalePrice : product.singlePrice}`, {
                x: 500, 
                y,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
            });

            y -= Math.max(imageHeight, lineHeight * 2) - 40; 
            page.drawLine({
                start: { x: 50, y },
                end: { x: width - 50, y },
                thickness: 1,
                color: rgb(0, 0, 0),
            });
            y -= lineHeight * 4; 
        }

        const footerText = `Ansar, Nabatieh, Lebanon | Phone:+961 76920892  | Email: info@wecare-lebanon.com`;
        const footerY = 50; 
        page.drawText(footerText, {
            x: 70,
            y: footerY - 20,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Convert PDF bytes to a base64 string
        const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

        // Send the base64 string as a JSON response
        res.json({
            success: true,
            pdf: pdfBase64,
        });
    } catch (error) {
        console.error('Error creating quotation:', error);
        res.status(500).json({ success: false, error: 'Failed to create quotation' });
    }
});



const createTextQuotation = asyncHandler(async (req, res) => {
    const { text } = req.body; // Get the text content from the request body

    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]); // Set page size (width, height)
        const { width, height } = page.getSize();

        // Set up fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        const lineHeight = 15;

        // Add company logo (top-left corner)
        const logoUrl = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg7k4y5SSYQvLYQkiXVjPHn4ueVgaICSkzRzPGqB7rb0XrQme9c_mN_JJy49nB7cfvVVLrOMnARiXsg4CPczlBIO1JM5pvC7gtJtzl8RhGxii9T8rimBr_4M7bHu5FADWP8NDYuxWqRPUHJOB1zRwmDpj8No6-tmrP0TSzuzZQcmw_CzeSB0RGrRq7x5S0/s400/Untitled-adad1.png';
        const logoResponse = await fetch(logoUrl);
        const logoBuffer = await logoResponse.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBuffer); // Assuming the logo is a PNG
        const logoDims = logoImage.scale(0.2); // Scale the logo to 20% of its original size
        page.drawImage(logoImage, {
            x: 50, // X position for the logo
            y: height - 50 - logoDims.height, // Y position for the logo
            width: logoDims.width,
            height: logoDims.height,
        });

        // Add current date (top-right corner)
        const currentDate = new Date().toLocaleDateString();
        const dateWidth = font.widthOfTextAtSize(currentDate, fontSize);
        page.drawText(currentDate, {
            x: width - 50 - dateWidth, // X position for the date
            y: height - 95, // Y position for the date
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        // Add text content below the logo and date
        let y = height - 100 - logoDims.height; // Start below the logo and date

        // Define the maximum width for the text
        const maxTextWidth = width - 100; // 50px margin on both sides

        // Split the text into paragraphs and add them to the PDF
        const paragraphs = text.split('\n'); // Split text by newlines
        for (const paragraph of paragraphs) {
            // Split the paragraph into lines that fit within the maxTextWidth
            const lines = [];
            let currentLine = '';
            const words = paragraph.split(' ');
            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const testWidth = font.widthOfTextAtSize(testLine, fontSize);
                if (testWidth <= maxTextWidth) {
                    currentLine = testLine;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }

            // Add each line to the PDF
            for (const line of lines) {
                if (y < 100) { // Bottom margin (adjust as needed)
                    // Create a new page if the current page is full
                    page = pdfDoc.addPage([600, 800]);
                    y = height - 50; // Reset Y position for the new page
                }

                page.drawText(line, {
                    x: 50, // X position for the text
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight; // Move down for the next line
            }

            y -= lineHeight; // Add extra space between paragraphs
        }

        // Add footer (company address, phone number, and email)
        const footerText = `Ansar, Nabatieh, Lebanon | Phone:+961 76920892  | Email: info@wecare-lebanon.com`;
        const footerY = 50; // Y position for the footer
        page.drawText(footerText, {
            x: 50,
            y: footerY,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
        });

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Convert PDF bytes to a base64 string
        const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

        // Send the base64 string as a JSON response
        res.json({
            success: true,
            pdf: pdfBase64,
            filename: `text-quotation-${currentDate}.pdf`,
        });
    } catch (error) {
        console.error('Error creating text quotation:', error);
        res.status(500).json({ success: false, error: 'Failed to create text quotation' });
    }
});

export {createProduct, getProducts, getProduct, editProduct, deleteProduct, getProductStats, createQuotation, createTextQuotation};