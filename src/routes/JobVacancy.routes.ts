import express from "express";
import {
    getAllFilteredAndSorted, getSimilarVacanciesById,
    getVacanciesByHr,
    getVacancy,
    SetVacancy
} from "../controllers/JobVacancy.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const JobVacancyRouter = express.Router();

JobVacancyRouter.post("/setVacancy/:hrId", authMiddleware, SetVacancy)
JobVacancyRouter.post("/getAllFilteredAndSorted", getAllFilteredAndSorted)
JobVacancyRouter.get("/getVacancy/:vacancyId", getVacancy)
JobVacancyRouter.get("/getVacanciesByHr/:hrId", getVacanciesByHr)
JobVacancyRouter.get("/getSimilarVacanciesById/:vacancyId", getSimilarVacanciesById)

export default JobVacancyRouter