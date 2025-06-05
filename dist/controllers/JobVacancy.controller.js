var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppDataSource } from "../dataSource.js";
import { Vacancy } from "../entities/JobVacancies.js";
import { JobCategory } from "../entities/JobCategories.js";
import { EmploymentType } from "../entities/EmploymentTypes.js";
import { VacancyLanguage } from "../entities/JobLanguages.js";
import { User } from "../entities/Users.js";
export const setVacancy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { positionTitle, salary, description, companyName, categoryName, yearsOfExperience, employmentTypeName, languages } = req.body;
    const { hrId } = req.params;
    try {
        const userRepo = AppDataSource.getRepository(User);
        const categoryRepo = AppDataSource.getRepository(JobCategory);
        const typeRepo = AppDataSource.getRepository(EmploymentType);
        const vacancyRepo = AppDataSource.getRepository(Vacancy);
        const languageRepo = AppDataSource.getRepository(VacancyLanguage);
        const user = yield userRepo.findOne({ where: { id: Number(hrId) } });
        if (!user) {
            res.status(404).json({ message: "HR not found" });
            return;
        }
        let category = yield categoryRepo.findOne({ where: { name: categoryName } });
        if (!category) {
            category = categoryRepo.create({ name: categoryName });
            yield categoryRepo.save(category);
        }
        let employmentType = yield typeRepo.findOne({ where: { type: employmentTypeName } });
        if (!employmentType) {
            employmentType = typeRepo.create({ type: employmentTypeName });
            yield typeRepo.save(employmentType);
        }
        const vacancy = vacancyRepo.create({
            positionTitle,
            salary,
            description,
            companyName,
            yearsOfExperience,
            user,
            category,
            employmentType
        });
        const savedVacancy = yield vacancyRepo.save(vacancy);
        for (const lang of languages) {
            const langEntity = languageRepo.create({
                vacancy: savedVacancy,
                languageName: lang.languageName,
                languageLevel: lang.languageLevel
            });
            yield languageRepo.save(langEntity);
        }
        res.status(200).json({ message: "Vacancy created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create vacancy", error });
    }
});
export const getAllFilteredAndSorted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { positionTitle, companyName, categoryName, employmentType, languageName, minSalary, maxSalary, minYearsOfExperience, maxYearsOfExperience, sortBy = "datePosted", sortDirection = "DESC", } = req.body;
    const page = parseInt(req.query.page || "0");
    const size = parseInt(req.query.size || "10");
    const offset = page * size;
    const vacancyRepo = AppDataSource.getRepository(Vacancy);
    const languageRepo = AppDataSource.getRepository(VacancyLanguage);
    try {
        const queryBuilder = vacancyRepo.createQueryBuilder("vacancy")
            .leftJoinAndSelect("vacancy.category", "category")
            .leftJoinAndSelect("vacancy.employmentType", "employmentType")
            .leftJoinAndSelect("vacancy.user", "user")
            .leftJoinAndSelect("vacancy.languages", "language");
        if (positionTitle) {
            queryBuilder.andWhere("vacancy.positionTitle ILIKE :positionTitle", { positionTitle: `%${positionTitle}%` });
        }
        if (companyName) {
            queryBuilder.andWhere("vacancy.companyName ILIKE :companyName", { companyName: `%${companyName}%` });
        }
        if (categoryName) {
            queryBuilder.andWhere("category.name ILIKE :categoryName", { categoryName: `%${categoryName}%` });
        }
        if (employmentType) {
            queryBuilder.andWhere("employmentType.type ILIKE :employmentType", { employmentType: `%${employmentType}%` });
        }
        if (languageName) {
            queryBuilder.andWhere("language.languageName ILIKE :languageName", { languageName: `%${languageName}%` });
        }
        if (minSalary !== undefined) {
            queryBuilder.andWhere("vacancy.salary >= :minSalary", { minSalary });
        }
        if (maxSalary !== undefined && maxSalary > 0) {
            queryBuilder.andWhere("vacancy.salary <= :maxSalary", { maxSalary });
        }
        if (minYearsOfExperience !== undefined) {
            queryBuilder.andWhere("vacancy.yearsOfExperience >= :minYearsOfExperience", { minYearsOfExperience });
        }
        if (maxYearsOfExperience !== undefined && maxYearsOfExperience > 0) {
            queryBuilder.andWhere("vacancy.yearsOfExperience <= :maxYearsOfExperience", { maxYearsOfExperience });
        }
        queryBuilder.orderBy(`vacancy.${sortBy}`, sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC");
        queryBuilder.skip(offset).take(size);
        const [vacancies, totalElements] = yield queryBuilder.getManyAndCount();
        const vacancyIds = vacancies.map(v => v.id);
        const languages = yield languageRepo
            .createQueryBuilder("languages")
            .where("languages.vacancy_id IN (:...vacancyIds)", { vacancyIds })
            .getMany();
        const content = vacancies.map(vacancy => ({
            id: vacancy.id,
            positionTitle: vacancy.positionTitle,
            salary: vacancy.salary,
            description: vacancy.description,
            companyName: vacancy.companyName,
            datePosted: vacancy.datePosted,
            categoryName: vacancy.category.name,
            yearsOfExperience: vacancy.yearsOfExperience,
            employmentTypeName: vacancy.employmentType.type,
            languages: languages
                .filter(lang => lang.vacancy.id === vacancy.id)
                .map(lang => ({
                languageName: lang.languageName,
                languageLevel: lang.languageLevel
            }))
        }));
        const totalPages = Math.ceil(totalElements / size);
        res.status(200).json({
            totalPages,
            totalElements,
            size,
            content,
            number: page,
            sort: {
                empty: false,
                sorted: true,
                unsorted: false
            },
            first: page === 0,
            last: page >= totalPages - 1,
            pageable: {
                offset,
                sort: {
                    empty: false,
                    sorted: true,
                    unsorted: false
                },
                pageSize: size,
                pageNumber: page,
                paged: true,
                unpaged: false
            },
            numberOfElements: content.length,
            empty: content.length === 0
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error while fetching vacancies", error });
    }
});
export const getVacancy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vacancyId } = req.params;
    try {
        const vacancyRepo = AppDataSource.getRepository(Vacancy);
        const languageRepo = AppDataSource.getRepository(VacancyLanguage);
        const vacancy = yield vacancyRepo.findOne({
            where: { id: Number(vacancyId) },
            relations: ["category", "employmentType"],
        });
        if (!vacancy) {
            res.status(404).json({ message: "Vacancy not found" });
            return;
        }
        const languages = yield languageRepo.find({
            where: { vacancy: { id: vacancy.id } },
        });
        res.status(200).json({
            id: vacancy.id,
            positionTitle: vacancy.positionTitle,
            salary: vacancy.salary,
            description: vacancy.description,
            companyName: vacancy.companyName,
            datePosted: vacancy.datePosted,
            categoryName: vacancy.category.name,
            yearsOfExperience: vacancy.yearsOfExperience,
            employmentTypeName: vacancy.employmentType.type,
            languages: languages.map(lang => ({
                languageName: lang.languageName,
                languageLevel: lang.languageLevel
            }))
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving vacancy", error });
    }
});
export const getVacanciesByHr = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hrId } = req.params;
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;
    const hrIdNum = Number(hrId);
    if (isNaN(hrIdNum)) {
        res.status(400).json({ message: "Invalid HR ID" });
        return;
    }
    try {
        const vacancyRepo = AppDataSource.getRepository(Vacancy);
        const languageRepo = AppDataSource.getRepository(VacancyLanguage);
        const [vacancies, total] = yield vacancyRepo.findAndCount({
            where: { user: { id: hrIdNum } },
            relations: ["category", "employmentType", "user"],
            skip: page * size,
            take: size,
            order: { datePosted: "DESC" }
        });
        const content = yield Promise.all(vacancies.map((vacancy) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const languages = yield languageRepo.find({
                    where: { vacancy: { id: vacancy.id } }
                });
                return {
                    id: vacancy.id,
                    positionTitle: vacancy.positionTitle,
                    salary: vacancy.salary,
                    description: vacancy.description,
                    companyName: vacancy.companyName,
                    datePosted: vacancy.datePosted,
                    categoryName: (_b = (_a = vacancy.category) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Uncategorized",
                    yearsOfExperience: vacancy.yearsOfExperience,
                    employmentTypeName: (_d = (_c = vacancy.employmentType) === null || _c === void 0 ? void 0 : _c.type) !== null && _d !== void 0 ? _d : "No employment type",
                    languages: languages.map(l => ({
                        languageName: l.languageName,
                        languageLevel: l.languageLevel
                    }))
                };
            }
            catch (innerError) {
                return null;
            }
        })));
        const filteredContent = content.filter(item => item !== null);
        const totalPages = Math.ceil(total / size);
        res.status(200).json({
            totalPages,
            totalElements: total,
            size,
            content: filteredContent,
            number: page,
            sort: {
                empty: true,
                sorted: true,
                unsorted: true
            },
            first: page === 0,
            last: page >= totalPages - 1,
            pageable: {
                offset: page * size,
                sort: {
                    empty: true,
                    sorted: true,
                    unsorted: true
                },
                pageSize: size,
                pageNumber: page,
                paged: true,
                unpaged: false
            },
            numberOfElements: filteredContent.length,
            empty: filteredContent.length === 0
        });
    }
    catch (error) {
        console.error("❌ Глобальна помилка при отриманні вакансій HR:", error);
        if (error instanceof Error) {
            console.error("🧠 Stack trace:", error.stack);
        }
        res.status(500).json({
            message: "Error fetching HR vacancies",
            error: error instanceof Error ? error.message : error
        });
    }
});
export const getSimilarVacanciesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vacancyId } = req.params;
    const size = parseInt(req.query.size) || 5;
    try {
        const vacancyRepo = AppDataSource.getRepository(Vacancy);
        const languageRepo = AppDataSource.getRepository(VacancyLanguage);
        const targetVacancy = yield vacancyRepo.findOne({
            where: { id: Number(vacancyId) },
            relations: ["category", "employmentType"]
        });
        if (!targetVacancy) {
            res.status(404).json({ message: "Vacancy not found" });
            return;
        }
        const targetLanguages = yield languageRepo.find({
            where: { vacancy: { id: targetVacancy.id } }
        });
        const targetLanguageNames = targetLanguages.map(l => l.languageName);
        const similarVacancies = yield vacancyRepo
            .createQueryBuilder("vacancy")
            .leftJoinAndSelect("vacancy.category", "category")
            .leftJoinAndSelect("vacancy.employmentType", "employmentType")
            .where("vacancy.id != :id", { id: targetVacancy.id })
            .andWhere("vacancy.category = :categoryId", { categoryId: targetVacancy.category.id })
            .andWhere("vacancy.employmentType = :employmentTypeId", { employmentTypeId: targetVacancy.employmentType.id })
            .orderBy("vacancy.datePosted", "DESC")
            .take(size)
            .getMany();
        const content = yield Promise.all(similarVacancies.map((vacancy) => __awaiter(void 0, void 0, void 0, function* () {
            const languages = yield languageRepo.find({
                where: { vacancy: { id: vacancy.id } }
            });
            return {
                id: vacancy.id,
                positionTitle: vacancy.positionTitle,
                salary: vacancy.salary,
                description: vacancy.description,
                companyName: vacancy.companyName,
                datePosted: vacancy.datePosted,
                categoryName: vacancy.category.name,
                yearsOfExperience: vacancy.yearsOfExperience,
                employmentTypeName: vacancy.employmentType.type,
                languages: languages.map(l => ({
                    languageName: l.languageName,
                    languageLevel: l.languageLevel
                }))
            };
        })));
        res.status(200).json(content);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching similar vacancies", error });
    }
});
//# sourceMappingURL=JobVacancy.controller.js.map