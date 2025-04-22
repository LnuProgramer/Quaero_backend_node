import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./Entities/Users.js";
import { UserInfo } from "./Entities/UserAdditionalInfo.js";
import { Vacancy } from "./Entities/JobVacancies.js"
import { VacancyLanguage } from "./Entities/JobLanguages.js"
import { JobCategory } from  "./Entities/JobCategories.js"
import { EmploymentType } from  "./Entities/EmploymentTypes.js"

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, UserInfo, Vacancy, VacancyLanguage, JobCategory, EmploymentType],
});