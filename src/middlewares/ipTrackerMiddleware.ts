import {Request, Response, NextFunction} from "express";

export const ipTrackerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const ipRequestCount = {}
    if (!ipRequestCount [ip]) {
        ipRequestCount[ip] = 0;
    }
    ipRequestCount[ip]++;
    next()
}
