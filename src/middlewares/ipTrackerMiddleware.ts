import {Request, Response, NextFunction} from "express";
import {HttpStatuses} from "../types/httpStatuses";

const ipRequestCount:{[key:string]:{count: number, lastRequestTime: number}} = {}

export const ipTrackerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const currentTime = Date.now();

    if (typeof ip === "undefined") {
        res.sendStatus(HttpStatuses.BAD_REQUEST);
        return
    }

    if (!ipRequestCount [ip]) {
        ipRequestCount[ip] = {count:0, lastRequestTime: currentTime};
    } else {
        if (currentTime - ipRequestCount[ip].lastRequestTime > 3600) {
            ipRequestCount[ip].count = 0;
        }
        ipRequestCount[ip].lastRequestTime = currentTime;
    }
    ipRequestCount[ip].count++;

    if (ipRequestCount[ip].count > 5) {
        res.sendStatus(429)
    }
    next()
}
