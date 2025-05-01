import jwt from "jsonwebtoken";

export const generateTokens = (
    payload: object,
    includeRefreshToken: boolean
): { accessToken: string; refreshToken?: string } => {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "15m",
    });

    let refreshToken: string | undefined;
    if (includeRefreshToken) {
        refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: "7d",
        });
    }

    return { accessToken, refreshToken };
};

