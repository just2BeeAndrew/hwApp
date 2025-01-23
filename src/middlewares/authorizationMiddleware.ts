import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {usersQueryRepository} from "../users/usersQueryRepository";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(" ")[1];

    const userId = await jwtService.getUserIdByToken(token);
    if (userId) {
        req.user = await usersQueryRepository.getUserBy_Id(userId)
        next()
    }
    res.sendStatus(401);


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