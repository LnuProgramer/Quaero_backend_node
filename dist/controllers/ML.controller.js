var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { trainModel, saveModelToDb, loadModelFromDb } from '../ml/model.js';
import { PageTransition } from "../entities/PageTransition.js";
import { AppDataSource } from "../dataSource.js";
import * as tf from '@tensorflow/tfjs';
export const trainAndSaveModel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transitions = yield AppDataSource.getRepository(PageTransition).find();
        if (!transitions || transitions.length === 0) {
            res.status(400).json({ error: 'No page transitions found' });
            return;
        }
        const { modelJson, modelWeights, pages } = yield trainModel(transitions);
        yield saveModelToDb(modelJson, modelWeights, 1, pages);
        res.status(200).json({ message: 'Model trained and saved successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to train and save model' });
    }
});
export const predictNextPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentPage } = req.body;
        if (!currentPage) {
            res.status(400).json({ error: 'Current page is required' });
            return;
        }
        const modelData = yield loadModelFromDb(1); // завантажуємо модель з БД
        const pages = modelData.pages;
        const inputIndex = pages.indexOf(currentPage);
        if (inputIndex === -1) {
            res.status(400).json({ error: 'Unknown page' });
            return;
        }
        const modelJson = JSON.parse(modelData.modelJson);
        const weightsBuffer = Uint8Array.from(Buffer.from(modelData.weightBinBase64, 'base64')).buffer;
        const handler = {
            load: () => __awaiter(void 0, void 0, void 0, function* () {
                return ({
                    modelTopology: modelJson.modelTopology,
                    weightSpecs: modelJson.weightSpecs,
                    weightData: weightsBuffer,
                });
            }),
        };
        const model = yield tf.loadLayersModel(handler);
        const inputTensor = tf.tensor2d([[inputIndex]]);
        const prediction = model.predict(inputTensor);
        const predictionArray = yield prediction.array();
        const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
        const predictedPage = pages[predictedIndex];
        res.status(200).json({ nextPage: predictedPage });
    }
    catch (error) {
        console.error('Prediction failed:', error);
        res.status(500).json({ error: 'Prediction failed' });
    }
});
export const saveTransition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.body;
    if (!from || !to) {
        res.status(400).json({ error: 'Both "from" and "to" are required' });
        return;
    }
    const transition = new PageTransition();
    transition.from = from;
    transition.to = to;
    yield AppDataSource.getRepository(PageTransition).save(transition);
    res.status(201).json({ message: 'Transition saved' });
});
//# sourceMappingURL=ML.controller.js.map