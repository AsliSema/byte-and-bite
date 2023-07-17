import express from "express";
import { createDish } from '../controllers/dish';
import { protect, allowedTo } from "../middlewares/authMiddleware";




const router = express.Router();


router.route("/").post(protect, allowedTo(["cook"]), createDish)


export default router;