import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {usersRepository} from "../users/usersRepository";
import {IdType} from "../types/id";
import {HttpStatuses} from "../types/httpStatuses";

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        console.log("Тут упал точка 1");
        res.sendStatus(HttpStatuses.UNAUTHORIZED);
        return
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log(token)

    const payload = await jwtService.verifyToken(token);
    if (payload) {
        const {userId} = payload;
        console.log(userId);

        const user = await usersRepository.doesExistById(userId);
        console.log(user);

        if (!user) {
            console.log("Тут упал точка 2");
            res.sendStatus(HttpStatuses.UNAUTHORIZED);
            return
        }

        req.user = {id:userId} as IdType;
        console.log(req.user);
        next()
        return
    }
    console.log("Тут упал точка 3");
    res.sendStatus(HttpStatuses.UNAUTHORIZED);
}