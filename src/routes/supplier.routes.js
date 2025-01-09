import express from "express";
import { getSuppliers, getSupplier, createSupplier, editSupplier, deleteSupplier } from "../controllers/supplier.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.get("/", /* isLoggedIn, */getSuppliers);
router.get("/:id", /* isLoggedIn, */getSupplier);
router.post("/add",/* isLoggedIn, */ createSupplier);
router.put("/edit/:id", /* isLoggedIn, */editSupplier);
router.delete("/delete/:id", /* isLoggedIn, */deleteSupplier);

export default router;