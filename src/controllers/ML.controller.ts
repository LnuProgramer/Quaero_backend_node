import { Request, Response } from 'express';
import { trainModel, saveModelToDb, loadModelFromDb } from '../ml/model.js';
import { PageTransition } from "../entities/PageTransition.js";
import { AppDataSource } from "../dataSource.js";
import * as tf from '@tensorflow/tfjs';

export const trainAndSaveModel = async (req: Request, res: Response) => {
    try {
        const transitions = await AppDataSource.getRepository(PageTransition).find();

        if (!transitions || transitions.length === 0) {
            res.status(400).json({ error: 'No page transitions found' });
            return;
        }

        const { modelJson, modelWeights, pages } = await trainModel(transitions);

        await saveModelToDb(modelJson, modelWeights, 1, pages);

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
            return
        }

        const modelData = await loadModelFromDb(1); // завантажуємо модель з БД
        const pages = modelData.pages;

        const inputIndex = pages.indexOf(currentPage);
        if (inputIndex === -1) {
            res.status(400).json({ error: 'Unknown page' });
            return
        }

        const modelJson = JSON.parse(modelData.modelJson);
        const weightsBuffer = Uint8Array.from(
            Buffer.from(modelData.weightBinBase64, 'base64')
        ).buffer;

        const handler: tf.io.IOHandler = {
            load: async () => ({
                modelTopology: modelJson.modelTopology,
                weightSpecs: modelJson.weightSpecs,
                weightData: weightsBuffer,
            }),
        };

        const model = await tf.loadLayersModel(handler);

        const inputTensor = tf.tensor2d([[inputIndex]]);
        const prediction = model.predict(inputTensor) as tf.Tensor;

        const predictionArray = await prediction.array() as number[][];
        const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
        const predictedPage = pages[predictedIndex];

        res.status(200).json({ nextPage: predictedPage });
    } catch (error) {
        console.error('Prediction failed:', error);
        res.status(500).json({ error: 'Prediction failed' });
    }
};

export const saveTransition = async (req: Request, res: Response) => {
    const { from, to } = req.body;

    if (!from || !to) {
        res.status(400).json({ error: 'Both "from" and "to" are required' });
        return;
    }

    const transition = new PageTransition();
    transition.from = from;
    transition.to = to;

    await AppDataSource.getRepository(PageTransition).save(transition);

    res.status(201).json({ message: 'Transition saved' });
};
