import express from "express";
import cors from "cors";
import 'reflect-metadata';
import { AppDataSource } from "./dataSource.js";
const port = 8000;
const app = express();
app.use(cors());
app.use(express.json());
AppDataSource.initialize()
    .catch((err) => {
    console.log("Error during Data Source initialization:", err);
});
app.listen(port, () => {
});
//# sourceMappingURL=index.js.map