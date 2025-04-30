import express from "express";
import cors from "cors"
import 'reflect-metadata';
import { AppDataSource } from "./dataSource.js";
import SecurityRouter from "./routes/Security.routes.js";
import ProfileRouter from "./routes/Profile.routes.js";

const port = 8080;
const app = express();
app.use(cors())
app.use(express.json());

app.use("/auth", SecurityRouter);
app.use("/profile", ProfileRouter)


AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected");

        app.listen(port, () => {
            console.log(`🚀 Server is running on port: ${port}`);
        });
    })
    .catch((error) => console.error("❌ Database connection error:", error));