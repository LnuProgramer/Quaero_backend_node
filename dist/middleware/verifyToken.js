import jwt from "jsonwebtoken";
import { generateTokens } from "./GenerateTokens.js";
export const verifyAccessToken = (accessToken, refreshToken) => {
    if (!accessToken) {
        return { success: false, message: "Access token is missing" };
    }
    try {
        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return { success: true, payload };
    }
    catch (err) {
        if (refreshToken) {
            try {
                const refreshPayload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const newTokens = generateTokens({ userId: refreshPayload.userId, role: refreshPayload.role }, false);
                return {
                    success: true,
                    payload: refreshPayload,
                    newAccessToken: newTokens.accessToken,
                };
            }
            catch (refreshErr) {
                return { success: false, message: "Refresh token is invalid or expired" };
            }
        }
        else {
            return { success: false, message: "Access token is invalid or expired, and no refresh token provided" };
        }
    }
};
//# sourceMappingURL=verifyToken.js.map