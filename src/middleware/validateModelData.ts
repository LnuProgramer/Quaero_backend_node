import { Request, Response, NextFunction } from 'express';

export const validateModelData = (req: Request, res: Response, next: NextFunction) => {
    const { data } = req.body;
    if (!Array.isArray(data) || data.length === 0 || !data.every(item => item.from && item.to)) {
        res.status(400).json({ error: 'Invalid data format' });
        return;
    }
    next();
};
