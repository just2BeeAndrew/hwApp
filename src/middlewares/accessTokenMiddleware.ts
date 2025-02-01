import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {usersRepository} from "../users/usersRepository";
import {IdType} from "../types/id";
import {HttpStatuses} from "../types/httpStatuses";

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HttpStatuses.UNAUTHORIZED);
        return
    }

    const token = req.headers.authorization.split(" ")[1];

    const payload = await jwtService.verifyToken(token);
    if (payload) {
        const {userId} = payload;

        const user = await usersRepository.doesExistById(userId);

        if (!user) {
            res.sendStatus(HttpStatuses.UNAUTHORIZED);
            return
        }

        req.user = {id:userId} as IdType;
        next()
    }
    res.sendStatus(HttpStatuses.UNAUTHORIZED);
}