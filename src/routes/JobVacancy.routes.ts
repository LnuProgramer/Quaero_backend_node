import express from "express";
import {
    getAllFilteredAndSorted, getSimilarVacanciesById,
    getVacanciesByHr,
    getVacancy,
    SetVacancy
} from "../controllers/JobVacancy.controller.js";

const JobVacancyRouter = express.Router();

JobVacancyRouter.post("/setVacancy/:hrId", SetVacancy)
JobVacancyRouter.post("/getAllFilteredAndSorted", getAllFilteredAndSorted)
JobVacancyRouter.get("/getVacancy/:vacancyId", getVacancy)
JobVacancyRouter.get("/getVacanciesByHr/:hrId", getVacanciesByHr)
JobVacancyRouter.get("/getSimilarVacanciesById/:vacancyId", getSimilarVacanciesById)

export default JobVacancyRouter