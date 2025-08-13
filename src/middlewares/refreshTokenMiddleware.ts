import {Request, Response, NextFunction} from "express";
import {HttpStatuses} from "../types/httpStatuses";
import {jwtService} from "../application/jwtService";
import {DeviceId, IdType} from "../types/id";
import {UsersRepository} from "../users/usersRepository";
import {devicesRepository} from "../securityDevices/devicesRepository";
import {container} from "../composition-root";

const usersRepository = container.get(UsersRepository);

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
    }

    try {
        const payload = await jwtService.verifyRefreshToken(refreshToken);
        if (payload) {
            const {userId, deviceId, iat} = payload;
//объединить iat и deviceid
            const session = await devicesRepository.findByUserAndDevice(userId, deviceId);
            if (!session) {
                res.sendStatus(HttpStatuses.UNAUTHORIZED);
                return
            }

            if (session.iat !== iat) {
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