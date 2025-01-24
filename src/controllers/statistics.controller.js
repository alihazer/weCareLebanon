import asyncHandler from 'express-async-handler';
import Invoice from '../models/invoice.model.js';
import Profit from '../models/profit.model.js';


// @desc get profit statistics
const getProfitStatistics = asyncHandler(async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const stats = await Profit.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(year, 0, 1), 
                        $lte: new Date(year, 11, 31, 23, 59, 59), 
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" }, 
                    totalProfit: { $sum: "$totalProfit" }, 
                },
            },
            { $sort: { "_id": 1 } }, 
        ]);

        const allMonths = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            totalProfit: 0,
        }));


        stats.forEach(stat => {
            const monthIndex = stat._id - 1; 
            allMonths[monthIndex].totalProfit = stat.totalProfit;
        });

        res.status(200).json({
            status: true,
            data: allMonths,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching profit statistics",
            error: error.message,
        });
    }
});

const getInvoiceStatistics = asyncHandler(async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

        const stats = await Invoice.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(year, 0, 1),
                        $lte: new Date(year, 11, 31, 23, 59, 59),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalInvoices: { $sum: 1 }, 
                },
            },
            { $sort: { "_id": 1 } }, 
        ]);


        const allMonths = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            totalInvoices: 0,
        }));

   
        stats.forEach(stat => {
            const monthIndex = stat._id - 1; 
            allMonths[monthIndex].totalInvoices = stat.totalInvoices;
        });

        res.status(200).json({
            status: true,
            data: allMonths,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching invoice statistics",
            error: error.message,
        });
    }
});

const getTopProductsByMonth = asyncHandler(async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();

    
        const stats = await Invoice.aggregate([
            { $unwind: "$products" }, 
            {
                $match: {
                    createdAt: {
                        $gte: new Date(year, 0, 1), 
                        $lte: new Date(year, 11, 31, 23, 59, 59), 
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        productId: "$products.productId",
                    },
                    totalQuantity: { $sum: "$products.quantity" }, 
                },
            },
            {
                $sort: { "_id.month": 1, totalQuantity: -1 },
            },
            {
                $group: {
                    _id: "$_id.month",
                    topProducts: {
                        $push: {
                            productId: "$_id.productId",
                            totalQuantity: "$totalQuantity",
                        },
                    },
                },
            },
            {
                $project: {
                    month: "$_id",
                    topProducts: { $slice: ["$topProducts", 3] }, 
                    _id: 0,
                },
            },
            { $unwind: "$topProducts" }, 
            {
                $lookup: {
                    from: "products", 
                    localField: "topProducts.productId",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            {
                $unwind: "$productDetails", 
            },
            {
                $project: {
                    month: 1,
                    "topProducts.productId": 1,
                    "topProducts.totalQuantity": 1,
                    "topProducts.productName": "$productDetails.name", 
                },
            },
            {
                $group: {
                    _id: "$month",
                    topProducts: { $push: "$topProducts" },
                },
            },
            {
                $project: {
                    month: "$_id",
                    topProducts: 1,
                    _id: 0,
                },
            },
            { $sort: { month: 1 } }, 
        ]);

        res.status(200).json({
            status: true,
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while fetching top products by month",
            error: error.message,
        });
    }
});



export { getProfitStatistics, getInvoiceStatistics, getTopProductsByMonth };