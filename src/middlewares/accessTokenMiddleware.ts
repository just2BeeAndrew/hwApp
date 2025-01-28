import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {usersRepository} from "../users/usersRepository";
import {IdType} from "../types/id";
import {HttpStatuses} from "../types/httpStatuses";

export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(HttpStatuses.UNAUTHORIZED);

    const token = req.headers.authorization.split(" ")[1];

    const payload = await jwtService.verifyToken(token);
    if (payload) {
        const {userId} = payload;
        const user = await usersRepository.doesExistById(userId);
        if (!user) return res.sendStatus(HttpStatuses.UNAUTHORIZED);
        req.user = {id:userId} as IdType;
        return next()
    }
    return  res.sendStatus(HttpStatuses.UNAUTHORIZED);




    // if (!req.headers.authorization) {
    //     res.sendStatus(401);
    //     return;
    // }
    //
    // const token = req.headers.authorization.split(" ")[1];
    //
    // const userId = await jwtService.getUserIdByToken(token);
    // if (userId) {
    //     req.user = await usersRepository.getUserBy_Id(userId)
    //     next()
    // }
    // res.sendStatus(401);
}