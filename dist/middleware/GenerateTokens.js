import jwt from "jsonwebtoken";
export const generateTokens = (payload, includeRefreshToken) => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    let refreshToken;
    if (includeRefreshToken) {
        refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "7d",
        });
    }
    return { accessToken, refreshToken };
};
//# sourceMappingURL=GenerateTokens.js.map