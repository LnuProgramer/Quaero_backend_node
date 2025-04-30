import { Request, Response } from "express";
import { AppDataSource } from "../dataSource.js";
import { User } from "../entities/Users.js";
import {UserInfo} from "../entities/UserAdditionalInfo.js";

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(userId) } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({
            id: user.id,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
            phone: user.phone ?? "",
            country: user.country ?? "",
            city: user.city ?? ""
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to get user info", error });
    }
};


export const setUserInfo = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const {
        firstName,
        lastName,
        email,
        phone,
        country,
        city,
        position,
        description,
        companyName,
        additionalInfo,
        role
    } = req.body;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const userInfoRepository = AppDataSource.getRepository(UserInfo);

        const user = await userRepo.findOne({ where: { id: Number(userId) } });
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
        user.description = description;
        user.companyName = companyName;
        user.role = role;

        await userRepo.save(user);

        let userInfo = await userInfoRepository.findOne({ where: { user: { id: Number(userId) } } });

        if (!userInfo) {
            userInfo = userInfoRepository.create({
                user: user,
                info: additionalInfo.join(", ")
            });
        } else {
            userInfo.info = additionalInfo.join(", ");
        }

        await userInfoRepository.save(userInfo);

        res.status(200).json({ message: "User info updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user info", error });
    }
};


export const getRole = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(userId) } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user.role);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user role", error });
    }
};


export const setAboutMe = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const aboutMeText: string = req.body;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(userId) } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        user.description = aboutMeText;
        await userRepo.save(user);

        res.status(200).json({ message: "Description updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update description", error });
    }
};


export const setAdditionalInfo = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const additionalInfo: string[] = req.body;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(userId) } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const infoRepo = AppDataSource.getRepository(UserInfo);

        // Видаляємо стару інформацію (якщо потрібно)
        await infoRepo.delete({ user: { id: user.id } });

        // Додаємо нову
        const infoEntities = additionalInfo.map((info) => {
            return infoRepo.create({ user, info });
        });

        await infoRepo.save(infoEntities);

        res.status(200).json({ message: "Additional info updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update additional info", error });
    }
};