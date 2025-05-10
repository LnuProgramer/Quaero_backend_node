import { Request, Response } from 'express';
import { trainModel, saveModelToDb, loadModelFromDb } from '../ml/model.js';
import * as tf from '@tensorflow/tfjs';

export const trainAndSaveModel = async (req: Request, res: Response) => {
    try {
        const data: { from: string, to: string }[] = req.body.data;

        if (!data || data.length === 0) {
            res.status(400).json({ error: 'Data is required' });
            return;
        }

        const { modelJson, modelWeights } = await trainModel(data);

        await saveModelToDb(modelJson, modelWeights, 1);

        res.status(200).json({ message: 'Model trained and saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to train and save model' });
    }
};

export const predictNextPage = async (req: Request, res: Response) => {
    try {
        const { currentPage } = req.body;

        if (!currentPage) {
           res.status(400).json({ error: 'Current page is required' });
            return;
        }

        const modelData = await loadModelFromDb(1); // Завантажуємо модель з БД

        const modelJson = JSON.parse(modelData.modelJson);
        const weightBytes = Uint8Array.from(atob(modelData.weightBinBase64), c => c.charCodeAt(0));
        const weightsBuffer = weightBytes.buffer;

        const handler: tf.io.IOHandler = {
            load: async () => ({
                modelTopology: modelJson.modelTopology,
                weightSpecs: modelJson.weightsManifest[0].weights,
                weightData: weightsBuffer,
            }),
        };

        const model = await tf.loadLayersModel(handler);

        const pages = ["home", "catalog", "vacancy/create", "profile", "profile/settings", "video-chat", "login"];
        const inputIndex = pages.indexOf(currentPage);

        if (inputIndex === -1) {
            res.status(400).json({ error: 'Unknown page' });
            return;
        }

        const inputTensor = tf.tensor2d([[inputIndex]]);
        const prediction = model.predict(inputTensor) as tf.Tensor;

        const predictedIndex = prediction.argMax(1).dataSync()[0];
        const predictedPage = pages[predictedIndex];

        res.status(200).json({ nextPage: predictedPage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Prediction failed' });
    }
};
