import {NextFunction, Request, Response} from "express";
import {usersService} from "../domains/usersService";
import {jwtService} from "../application/jwtService";
import {SETTINGS} from "../settings";
import {usersQueryRepository} from "../repositories/usersQueryRepository";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByToken(token);
    if (!userId) {
        res.sendStatus(401);
        next()
    }
    req.login  = await usersQueryRepository.getUserBy_Id(userId)
    next()

    // const data = `${SETTINGS.BASEAUTH.LOGIN}:${SETTINGS.BASEAUTH.PASSWORD}`
    //
    // let base64data = Buffer.from(data).toString('base64');
    // const validAuthValue = `Basic ${base64data}`;
    // const authHeader = req.headers.authorization;
    //
    // if (authHeader && authHeader === validAuthValue)
    //     next()
    // else res.sendStatus(401)
}