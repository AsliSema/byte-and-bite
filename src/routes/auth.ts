import express from "express";
import { getUserProfile, registerUser, signinUser } from '../controllers/auth'
import { protect } from "../middlewares/authMiddleware";



const router = express.Router();


router.route("/signup").post(registerUser)
router.route("/signin").post(signinUser);
router.route("/profile").get(protect, getUserProfile);


export default router;