import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.password) {
          res.status(400).json({ message: "Password is required" });
            return;
        }

        const saltRounds = 10;
        req.body.password = await bcrypt.hash(req.body.password, saltRounds);

        next();
    } catch (error) {
        res.status(500).json({ message: "Error hashing password", error });
    }
};
