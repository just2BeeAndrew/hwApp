import {Request, Response, NextFunction} from 'express';
import {HttpStatuses} from "../types/httpStatuses";
import {devicesRateRepository} from "../devicesRate/devicesRateRepository";

export const ipRateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip;
    const URL = req.originalUrl || req.baseUrl;
    const date = new Date();

    if (typeof IP === "undefined") {
        res.sendStatus(HttpStatuses.BAD_REQUEST);
        return
    }

    try {
        await devicesRateRepository.addRequestInfo(IP, URL, date);
        const requestCount = await devicesRateRepository.requestCount(IP, URL)
        if (requestCount > 5) {
            res.status(HttpStatuses.TOO_MANY_REQUEST).json({
                error: 'Too Many Requests. Limit: 5 requests per 10 seconds',
                retryAfter: 10
            });
            return
        }
        next();
    } catch (error) {
        console.error('Rate limiter error:', error);
        next();
    }
};