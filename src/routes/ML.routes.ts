import express from 'express';
import { trainAndSaveModel, predictNextPage, saveTransition } from "../controllers/ML.controller.js";

const MLRoutes = express.Router();

MLRoutes.post('/train', trainAndSaveModel);
MLRoutes.post('/predict', predictNextPage);
MLRoutes.post('/save-transition', saveTransition);

export default MLRoutes;
