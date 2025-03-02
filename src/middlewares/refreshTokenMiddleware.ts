import {Request, Response, NextFunction} from "express";
import {HttpStatuses} from "../types/httpStatuses";
import {jwtService} from "../application/jwtService";
import {SETTINGS} from "../settings";
import {IdType} from "../types/id";
import {usersRepository} from "../users/usersRepository";
import {authRepository} from "../auth/authRepository";
import {ResultStatus} from "../result/resultCode";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken
    console.log("1",refreshToken);
    // let token
    // if (req.cookies && req.cookies.refreshToken) {
    //     token = req.cookies.refreshToken;
    //     return
    // }
    if (!refreshToken) {
        console.log("2")
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
    }

    const isBlacklisted = await authRepository.isBlacklisted(refreshToken);
    if (isBlacklisted) {
        console.log("3")
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
        return
    }
    try {
        const payload = await jwtService.verifyRefreshToken(refreshToken);
        console.log(payload);
        if (payload) {
            const {userId} = payload;

            const user = await usersRepository.doesExistById(userId);

            if (!user) {
                console.log("4")
                res.sendStatus(HttpStatuses.UNAUTHORIZED);
                return
            }

            req.user = {id: userId} as IdType
            console.log("Выход есть")
            next()
            return
        }
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
        return
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "TokenExpiredError") {
                console.log("5")
                res.sendStatus(HttpStatuses.UNAUTHORIZED)
            }
        }
    }
    res.status(HttpStatuses.UNAUTHORIZED)
}