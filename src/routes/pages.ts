import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    // res.send('Express TS Version');
    res.render('home');
});

router.get("/login", (req, res) => {
    res.render("login");
});

export default router;