import express from "express";
import { signIn, signUp, updateAccessToken } from "../controllers/Security.controller.js";
import { hashPassword } from "../middleware/HashPassword.js";

const SecurityRouter = express.Router();

SecurityRouter.post("/signUp", hashPassword, signUp);
SecurityRouter.post("/signIn", signIn);
SecurityRouter.post("/updateAccessToken", updateAccessToken);

export default SecurityRouter;