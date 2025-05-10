import express from "express";
import cors from "cors"
import 'reflect-metadata';
import { AppDataSource } from "./dataSource.js";
import SecurityRouter from "./routes/Security.routes.js";
import ProfileRouter from "./routes/Profile.routes.js";
import JobVacancyRouter from "./routes/JobVacancy.routes.js";
import MLRoutes from "./routes/ML.routes.js";

const port = 8080;
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.text());

app.use("/auth", SecurityRouter);
app.use("/profile", ProfileRouter)
app.use("/job-vacancy", JobVacancyRouter)
app.use("/ml", MLRoutes);


AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected");

        app.listen(port, () => {
            console.log(`🚀 Server is running on port: ${port}`);
        });
    })
    .catch((error) => console.error("❌ Database connection error:", error));