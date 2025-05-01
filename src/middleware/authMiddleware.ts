import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "./verifyToken.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    const refreshToken = req.query.refreshToken as string | undefined;

    const result = verifyAccessToken(accessToken, refreshToken);

    if (!result.success) {
        res.status(401).json({ message: result.message });
        return;
    }

    // Якщо токен оновлено — повертаємо новий
    if (result.newAccessToken) {
        res.setHeader("x-new-access-token", result.newAccessToken);
    }

    req.user = result.payload;

    next();
};
