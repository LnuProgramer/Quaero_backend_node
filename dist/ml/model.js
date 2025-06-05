var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as tf from '@tensorflow/tfjs';
import { MlModel } from '../entities/MLModel.js';
import { AppDataSource } from '../dataSource.js';
export const trainModel = (data, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { embeddingDim = 3, learningRate = 0.1, batchSize = 2000, epochs = 100, } = options || {};
    const pages = Array.from(new Set(data.flatMap(d => [d.from, d.to]))).sort();
    const pageToIndex = Object.fromEntries(pages.map((p, i) => [p, i]));
    const xs = tf.tensor2d(data.map(d => [pageToIndex[d.from]]), [data.length, 1]);
    const ys = tf.tensor1d(data.map(d => pageToIndex[d.to]));
    const model = tf.sequential();
    model.add(tf.layers.embedding({
        inputDim: pages.length,
        outputDim: embeddingDim,
        inputLength: 1,
    }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({
        units: pages.length,
        activation: 'softmax',
    }));
    model.compile({
        loss: 'sparseCategoricalCrossentropy',
        optimizer: tf.train.adam(learningRate),
        metrics: ['accuracy'],
    });
    const history = yield model.fit(xs, ys, {
        epochs,
        batchSize,
        callbacks: tf.callbacks.earlyStopping({ monitor: 'loss', patience: 5 }),
    });
    const trainedEpochs = history.epoch.length;
    console.log(`Навчання завершено за ${trainedEpochs} епох`);
    let modelJson = '';
    let modelWeights = '';
    yield model.save(tf.io.withSaveHandler((artifacts) => __awaiter(void 0, void 0, void 0, function* () {
        modelJson = JSON.stringify({
            modelTopology: artifacts.modelTopology,
            weightSpecs: artifacts.weightSpecs
        });
        const weightData = new Uint8Array(artifacts.weightData);
        const finalBuffer = Buffer.from(weightData);
        modelWeights = finalBuffer.toString('base64');
        return {
            modelArtifactsInfo: {
                dateSaved: new Date(),
                modelTopologyType: 'JSON',
                modelTopologyBytes: JSON.stringify(artifacts.modelTopology).length,
                weightDataBytes: finalBuffer.byteLength
            }
        };
    })));
    return { modelJson, modelWeights, pages };
});
export const saveModelToDb = (modelJson, weightBinBase64, modelId, pages) => __awaiter(void 0, void 0, void 0, function* () {
    const model = new MlModel();
    model.id = modelId;
    model.modelJson = modelJson;
    model.weightBinBase64 = weightBinBase64;
    model.pages = pages;
    yield AppDataSource.getRepository(MlModel).save(model);
});
export const loadModelFromDb = (modelId) => __awaiter(void 0, void 0, void 0, function* () {
    const model = yield AppDataSource.getRepository(MlModel).findOne({ where: { id: modelId } });
    if (!model)
        throw new Error('Model not found');
    return model;
});
//# sourceMappingURL=model.js.map