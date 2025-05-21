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
import { User } from "../entities/Users.js";
import { UserInfo } from "../entities/UserAdditionalInfo.js";
export const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { userId } = req.params;
    try {
        const userRepo = AppDataSource.getRepository(User);
        const additionalRepo = AppDataSource.getRepository(UserInfo);
        const user = yield userRepo.findOne({ where: { id: Number(userId) } });
        if (!user) {
            res.status(404).json({ message: "User not found", id: userId });
            return;
        }
        const additional = yield additionalRepo.find({
            where: { user: { id: Number(userId) } },
        });
        res.json({
            id: user.id,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
            phone: (_a = user.phone) !== null && _a !== void 0 ? _a : "",
            country: (_b = user.country) !== null && _b !== void 0 ? _b : "",
            city: (_c = user.city) !== null && _c !== void 0 ? _c : "",
            companyName: (_d = user.companyName) !== null && _d !== void 0 ? _d : "",
            description: (_e = user.description) !== null && _e !== void 0 ? _e : "",
            additionalInfo: additional.map((a) => a.info),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get user info", error });
    }
});
export const setUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { firstName, lastName, email, phone, country, city, position, companyName, } = req.body;
    try {
        const userRepo = AppDataSource.getRepository(User);
        const userInfoRepository = AppDataSource.getRepository(UserInfo);
        const user = yield userRepo.findOne({ where: { id: Number(userId) } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phone = phone;
        user.country = country;
        user.city = city;
        user.position = position;
        user.companyName = companyName;
        yield userRepo.save(user);
        res.status(200).json({ message: "User info updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update user info", error });
    }
});
export const getRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = yield userRepo.findOne({ where: { id: Number(userId) } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user.role);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch user role", error });
    }
});
export const setAboutMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const aboutMeText = req.body;
    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = yield userRepo.findOne({ where: { id: Number(userId) } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.description = aboutMeText;
        yield userRepo.save(user);
        res.status(200).json({ message: "Description updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update description", error });
    }
});
export const setAdditionalInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const additionalInfo = req.body;
    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = yield userRepo.findOne({ where: { id: Number(userId) } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const infoRepo = AppDataSource.getRepository(UserInfo);
        yield infoRepo.delete({ user: { id: user.id } });
        const infoEntities = additionalInfo.map((info) => {
            return infoRepo.create({ user, info });
        });
        yield infoRepo.save(infoEntities);
        res.status(200).json({ message: "Additional info updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update additional info", error });
    }
});
//# sourceMappingURL=Profile.controller.js.map