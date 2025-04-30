import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../dataSource.js";
import { User } from "../entities/Users.js";
import { generateTokens } from "../middleware/GenerateTokens.js";
import jwt from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError } = jwt;

interface MyJwtPayload {
    userId: number;
    role: string;
    iat: number;
    exp: number;
}

export const signUp = async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password, role } = req.body;

    try {
        const userRepo = AppDataSource.getRepository(User);

        const existingUser = await userRepo.findOne({ where: { email } });
        if (existingUser) {
           res.status(409).json({ message: "User already exists" });
           return
        }

        const newUser = userRepo.create({ firstName, lastName, email, password, role });
        await userRepo.save(newUser);

        const { accessToken, refreshToken } = generateTokens({ userId: newUser.id, role: newUser.role });

        res.status(201).json({
            userId: newUser.id,
            accessToken,
            refreshToken,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
};


export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOne({ where: { email } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
           res.status(401).json({ message: "Invalid credentials" });
           return
        }

        const { accessToken, refreshToken } = generateTokens({ userId: user.id, role: user.role });

        res.status(200).json({
            userId: user.id,
            accessToken,
            refreshToken,
            firstName: user.firstName,
            lastName: user.lastName
        });
    } catch (error) {
        res.status(500).json({ message: "Sign-in failed", error });
    }
};


export const updateAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.params;

        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }

        try {
            const payload =  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as MyJwtPayload;

            const { userId, role } = payload;
            const tokens = generateTokens({ userId, role });

            res.json(tokens);
            return
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                res.status(401).json({ message: "Token expired" });
                return
            }
            if (err instanceof JsonWebTokenError) {
                res.status(401).json({ message: "Invalid token" });
                return
            }
            res.status(401).json({ message: "Authentication error" });
            return
        }
    } catch (error) {
        res.status(500).json({ message: "Token refresh failed", error });
    }
};