import express from 'express';
import { trainAndSaveModel, predictNextPage} from "../controllers/ML.controller.js";
import { validateModelData } from "../middleware/validateModelData.js";

const MLRoutes = express.Router();

MLRoutes.post('/train', trainAndSaveModel);

MLRoutes.post('/predict', validateModelData, predictNextPage);

export default MLRoutes;
