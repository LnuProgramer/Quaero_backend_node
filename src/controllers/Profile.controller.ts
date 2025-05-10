import { Request, Response } from "express";
import { AppDataSource } from "../dataSource.js";
import { User } from "../entities/Users.js";
import {UserInfo} from "../entities/UserAdditionalInfo.js";

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const additionalRepo = AppDataSource.getRepository(UserInfo);

        const user = await userRepo.findOne({ where: { id: Number(userId) } });

        if (!user) {
            res.status(404).json({ message: "User not found", id: userId });
            return;
        }

        const additional = await additionalRepo.find({
            where: { user: { id: Number(userId) } },
        });

        res.json({
            id: user.id,
            name: user.firstName,
            surname: user.lastName,
            email: user.email,
            phone: user.phone ?? "",
            country: user.country ?? "",
            city: user.city ?? "",
            companyName: user.companyName ?? "",
            description: user.description ?? "",
            additionalInfo: additional.map((a: UserInfo) => a.info),
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
        companyName,
    } = req.body;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const  userInfoRepository = AppDataSource.getRepository(UserInfo);

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
        user.companyName = companyName;

        await userRepo.save(user);

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

        await infoRepo.delete({ user: { id: user.id } });

        const infoEntities = additionalInfo.map((info) => {
            return infoRepo.create({ user, info });
        });

        await infoRepo.save(infoEntities);

        res.status(200).json({ message: "Additional info updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update additional info", error });
    }
};