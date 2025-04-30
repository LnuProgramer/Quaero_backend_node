import express from "express";
import { getRole, getUserInfo, setAboutMe, setAdditionalInfo, setUserInfo } from "../controllers/Profile.controller.js";

const ProfileRouter = express.Router();

ProfileRouter.get("/getUserInfo/:userId", getUserInfo);
ProfileRouter.patch("/setUserInfo/:userId", setUserInfo);
ProfileRouter.get("/getRole/:userId", getRole);
ProfileRouter.put("/setAboutMe/:userId", setAboutMe);
ProfileRouter.put("/setAdditionalInfo/:userId", setAdditionalInfo);

export default ProfileRouter;