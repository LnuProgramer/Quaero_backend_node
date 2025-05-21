var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import { AppDataSource } from "../dataSource.js";
import { User } from "../entities/Users.js";
import { generateTokens } from "../middleware/GenerateTokens.js";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;
export const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, role } = req.body;
    try {
        const userRepo = AppDataSource.getRepository(User);
        const existingUser = yield userRepo.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
            return;
        }
        const newUser = userRepo.create({ firstName, lastName, email, password, role });
        yield userRepo.save(newUser);
        const { accessToken, refreshToken } = generateTokens({ userId: newUser.id, role: newUser.role }, true);
        res.status(201).json({
            userId: newUser.id,
            accessToken,
            refreshToken,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
});
export const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepo = AppDataSource.getRepository(User);
        const user = yield userRepo.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const { accessToken, refreshToken } = generateTokens({ userId: user.id, role: user.role }, true);
        res.status(200).json({
            userId: user.id,
            accessToken,
            refreshToken,
            firstName: user.firstName,
            lastName: user.lastName
        });
    }
    catch (error) {
        res.status(500).json({ message: "Sign-in failed", error });
    }
});
export const updateAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.query;
        if (typeof refreshToken !== 'string') {
            res.status(400).json({ message: "Refresh token is required and must be a string" });
            return;
        }
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const { userId, role } = payload;
            const accessToken = generateTokens({ userId, role }, false);
            res.json(accessToken);
            return;
        }
        catch (err) {
            if (err instanceof TokenExpiredError) {
                res.status(401).json({ message: "Token expired" });
                return;
            }
            if (err instanceof JsonWebTokenError) {
                res.status(401).json({ message: "Invalid token" });
                return;
            }
            res.status(401).json({ message: "Authentication error" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ message: "Token refresh failed", error });
    }
});
//# sourceMappingURL=Security.controller.js.map