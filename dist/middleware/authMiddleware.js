import { verifyAccessToken } from "./verifyToken.js";
export const authMiddleware = (req, res, next) => {
    var _a;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Bearer <token>
    const refreshToken = req.headers["x-refresh-token"];
    const result = verifyAccessToken(accessToken, refreshToken);
    if (!result.success) {
        res.status(401).json({ message: result.message });
        return;
    }
    if (result.newAccessToken) {
        res.setHeader("x-new-access-token", result.newAccessToken);
    }
    req.user = result.payload;
    next();
};
//# sourceMappingURL=authMiddleware.js.map