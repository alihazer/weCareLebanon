import asyncHandler from 'express-async-handler';
import Cost from '../models/cost.model.js';

// @desc    Fetch all costs
// @route   GET /api/costs
// @access  Private
export const getCosts = asyncHandler(async(req, res)=>{
     try {
          const costs = await Cost.find({});
          return res.status(200).json(costs);
     } catch (error) {
          console.error(error);
          throw new Error(error);
          
     }
})

// @desc    Fetch single cost
// @route   GET /api/costs/:id
// @access  Private
export const getCostById = asyncHandler(async(req, res)=>{
     try {
          const cost = await Cost.findById(req.params.id);
          if(!cost){
               return res.status(404).json({message: "Cost not found"});
          }
          return res.status(200).json(cost);
     } catch (error) {
          console.error(error);
          throw new Error(error);
          
     }
})

// @desc    Create a cost
// @route   POST /api/costs
// @access  Private
export const createCost = asyncHandler(async(req, res)=>{
     try {
          const {name, amount, date} = req.body;
          const cost = new Cost({
               name,
               amount,
               date
          });
          const createdCost = await cost.save();
          return res.status(201).json({message: "Cost created Successfully", cost: createdCost});
     } catch (error) {
          console.error(error);
          throw new Error(error);
          
     }
})

// @desc    Update a cost
// @route   PUT /api/costs/:id
// @access  Private

export const updateCost = asyncHandler(async(req, res)=>{
     try {
          const {name, amount, date} = req.body;
          const cost = await Cost.findById(req.params.id);
          if(cost){
               cost.name = name;
               cost.amount = amount;
               cost.date = date;
               const updatedCost = await cost.save();
               return res.status(200).json(updatedCost);
          }else{
               return res.status(404).json({message: "Cost not found"});
          }
     } catch (error) {
          console.error(error);
          throw new Error(error);
          
     }
})

// @desc    Delete a cost
// @route   DELETE /api/costs/:id

export const deleteCost = asyncHandler(async(req, res)=>{
     try {
          const cost = await Cost.findById(req.params.id);
          if(cost){
               cost.status = "deleted";
               const updatedCost = await cost.save();
               return res.status(200).json(updatedCost);
          }else{
               return res.status(404).json({message: "Cost not found"});
          }
     } catch (error) {
          console.error(error);
          throw new Error(error)
     }
})