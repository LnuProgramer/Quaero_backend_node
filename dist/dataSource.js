import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./entities/Users.js";
import { UserInfo } from "./entities/UserAdditionalInfo.js";
import { Vacancy } from "./entities/JobVacancies.js";
import { VacancyLanguage } from "./entities/JobLanguages.js";
import { JobCategory } from "./entities/JobCategories.js";
import { EmploymentType } from "./entities/EmploymentTypes.js";
import { MlModel } from "./entities/MLModel.js";
import { PageTransition } from "./entities/PageTransition.js";
dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, UserInfo, Vacancy, VacancyLanguage, JobCategory, EmploymentType, MlModel, PageTransition],
});
//# sourceMappingURL=dataSource.js.map