import express from "express";
import { getAllFilteredAndSorted, getSimilarVacanciesById, getVacanciesByHr, getVacancy, setVacancy } from "../controllers/JobVacancy.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const JobVacancyRouter = express.Router();
JobVacancyRouter.post("/setVacancy/:hrId", authMiddleware, setVacancy);
JobVacancyRouter.post("/getAllFilteredAndSorted", getAllFilteredAndSorted);
JobVacancyRouter.get("/getVacancy/:vacancyId", getVacancy);
JobVacancyRouter.get("/getVacanciesByHr/:hrId", authMiddleware, getVacanciesByHr);
JobVacancyRouter.get("/getSimilarVacanciesById/:vacancyId", getSimilarVacanciesById);
export default JobVacancyRouter;
//# sourceMappingURL=JobVacancy.routes.js.map