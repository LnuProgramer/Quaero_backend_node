import * as tf from '@tensorflow/tfjs';
import { MlModel } from '../entities/MLModel.js';
import { AppDataSource } from '../dataSource.js';

export const trainModel = async (data: { from: string; to: string }[]) => {
    const pages = Array.from(new Set(data.flatMap(d => [d.from, d.to])));
    const pageToIndex = Object.fromEntries(pages.map((p, i) => [p, i]));

    const xs = tf.tensor2d(data.map(d => [pageToIndex[d.from]]));
    const ys = tf.tensor2d(data.map(d => [pageToIndex[d.to]]));

    const model = tf.sequential();
    model.add(tf.layers.embedding({ inputDim: pages.length, outputDim: 4, inputLength: 1 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: pages.length, activation: 'softmax' }));

    model.compile({ loss: 'sparseCategoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });

    await model.fit(xs, ys, { epochs: 20 });

    // <-- Зберігаємо модель у змінні
    let modelJson = '';
    let modelWeights = '';

    await model.save(tf.io.withSaveHandler(async (artifacts) => {
        modelJson = JSON.stringify({
            modelTopology: artifacts.modelTopology,
            weightsManifest: [{ weights: artifacts.weightSpecs }],
        });

        const weightData = artifacts.weightData!;
        let finalBuffer: Buffer;

        if (Array.isArray(weightData)) {
            const totalLength = weightData.reduce((sum, buf) => sum + buf.byteLength, 0);
            const joined = new Uint8Array(totalLength);
            let offset = 0;
            for (const ab of weightData) {
                joined.set(new Uint8Array(ab), offset);
                offset += ab.byteLength;
            }
            finalBuffer = Buffer.from(joined);
        } else {
            finalBuffer = Buffer.from(new Uint8Array(weightData));
        }

        modelWeights = finalBuffer.toString('base64');

        return {
            modelArtifactsInfo: {
                dateSaved: new Date(),
                modelTopologyType: 'JSON',
                modelTopologyBytes: JSON.stringify(artifacts.modelTopology).length,
                weightDataBytes: finalBuffer.byteLength,
            }
        };
    }));

    return { modelJson, modelWeights };
};

export const saveModelToDb = async (modelJson: string, weightBinBase64: string, modelId: number) => {
    const model = new MlModel();
    model.id = modelId;
    model.modelJson = modelJson;
    model.weightBinBase64 = weightBinBase64;

    await AppDataSource.getRepository(MlModel).save(model);
};

export const loadModelFromDb = async (modelId: number) => {
    const model = await AppDataSource.getRepository(MlModel).findOne({ where: { id: modelId } });
    if (!model) throw new Error('Model not found');

    return model;
};
