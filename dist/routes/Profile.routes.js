import express from "express";
import { getRole, getUserInfo, setAboutMe, setAdditionalInfo, setUserInfo } from "../controllers/Profile.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const ProfileRouter = express.Router();
ProfileRouter.get("/getUserInfo/:userId", authMiddleware, getUserInfo);
ProfileRouter.patch("/setUserInfo/:userId", authMiddleware, setUserInfo);
ProfileRouter.get("/getRole/:userId", authMiddleware, getRole);
ProfileRouter.put("/setAboutMe/:userId", authMiddleware, setAboutMe);
ProfileRouter.put("/setAdditionalInfo/:userId", authMiddleware, setAdditionalInfo);
export default ProfileRouter;
//# sourceMappingURL=Profile.routes.js.map