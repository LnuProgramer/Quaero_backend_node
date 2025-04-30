import express from "express";
import { signIn, signUp, updateAccessToken } from "../controllers/Security.controller.js";
import { hashPassword } from "../middleware/HashPassword.js";

const SecurityRouter = express.Router();

SecurityRouter.post("/signUp", hashPassword, signUp);
SecurityRouter.post("/signIn", signIn);
SecurityRouter.get("/updateAccessToken", updateAccessToken);

export default SecurityRouter;