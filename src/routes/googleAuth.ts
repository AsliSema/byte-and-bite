import { Request, Response } from '../types/express';
import express from "express";
import passport from "passport";
import generateToken from '../utils/generateToken';

const router = express.Router();

router.route("/google").get(passport.authenticate("google", {
    scope: ["email", "profile"],
}));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: '/', session: false }), (req: Request, res: Response) => {
    // res.send("You have been signed in successfully! You will be redirected to Home");
    // res.send({
    //     _id: req.user._id,
    //     firstname: req.user.firstname,
    //     lastname: req.user.lastname,
    //     email: req.user.email,
    //     token: generateToken(req.user._id),
    // });
    res.render('home');
});



export default router;
