import jwt from "jsonwebtoken";
import { generateTokens } from "./GenerateTokens.js"

interface MyJwtPayload {
    userId: number;
    role: string;
}

interface TokenResult {
    success: true;
    payload: MyJwtPayload;
    newAccessToken?: string;
}

interface TokenError {
    success: false;
    message: string;
}

export const verifyAccessToken = (
    accessToken: string | undefined,
    refreshToken?: string
): TokenResult | TokenError => {
    if (!accessToken) {
        return { success: false, message: "Access token is missing" };
    }

    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as MyJwtPayload;
        return { success: true, payload };
    } catch (err) {
        if (refreshToken) {
            try {
                const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as MyJwtPayload;
                const newTokens = generateTokens({ userId: refreshPayload.userId, role: refreshPayload.role }, false);

                return {
                    success: true,
                    payload: refreshPayload,
                    newAccessToken: newTokens.accessToken,
                };
            } catch (refreshErr) {
                return { success: false, message: "Refresh token is invalid or expired" };
            }
        } else {
            return { success: false, message: "Access token is invalid or expired, and no refresh token provided" };
        }
    }
};
