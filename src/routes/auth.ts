import express from "express";
import { getAllUsers, getUserProfile, registerUser, signinUser } from '../controllers/auth'
import { allowedTo, protect } from "../middlewares/authMiddleware";



const router = express.Router();


router.route("/signup").post(registerUser)
router.route("/signin").post(signinUser);
router.route("/profile").get(protect, getUserProfile);
router.route("/").get(protect, allowedTo(["admin"]), getAllUsers);

export default router;