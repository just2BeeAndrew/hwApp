import {Request, Response, NextFunction} from "express";
import {HttpStatuses} from "../types/httpStatuses";
import {jwtService} from "../application/jwtService";
import {DeviceId, IdType} from "../types/id";
import {usersRepository} from "../users/usersRepository";
import {authRepository} from "../auth/authRepository";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
    }

    const isBlacklisted = await authRepository.isBlacklisted(refreshToken);
    if (isBlacklisted) {
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
        return
    }
    try {
        const payload = await jwtService.verifyRefreshToken(refreshToken);
        if (payload) {
            const {userId, deviceId} = payload;

            const user = await usersRepository.doesExistById(userId);

            if (!user) {
                res.sendStatus(HttpStatuses.UNAUTHORIZED);
                return
            }

            req.user = {id: userId} as IdType
            req.device = {deviceId: deviceId} as DeviceId
            next()
            return
        }
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "TokenExpiredError") {
                res.sendStatus(HttpStatuses.UNAUTHORIZED)
            }
        }
    }
    res.status(HttpStatuses.UNAUTHORIZED)
}