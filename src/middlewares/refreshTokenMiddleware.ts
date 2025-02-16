import {Request, Response, NextFunction} from "express";
import {HttpStatuses} from "../types/httpStatuses";
import {jwtService} from "../application/jwtService";
import {SETTINGS} from "../settings";
import {IdType} from "../types/id";
import {usersRepository} from "../users/usersRepository";

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken
    // let token
    // if (req.cookies && req.cookies.refreshToken) {
    //     token = req.cookies.refreshToken;
    //     return
    // }
    if (!token) {
        res.sendStatus(HttpStatuses.UNAUTHORIZED)
    }

    const payload = await jwtService.verifyToken(token, SETTINGS.REFRESH_TOKEN_SECRET);
    if (payload) {
        const {userId} = payload;

        const user = await usersRepository.doesExistById(userId);

        if (!user) {
            res.sendStatus(HttpStatuses.UNAUTHORIZED);
            return
        }

        req.user = {id: userId} as IdType
        next()
        return
    }
    res.status(HttpStatuses.UNAUTHORIZED)
}