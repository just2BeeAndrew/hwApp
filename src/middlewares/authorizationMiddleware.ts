import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../settings";

export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const data = `${SETTINGS.BASEAUTH.LOGIN}:${SETTINGS.BASEAUTH.PASSWORD}`
    console.log("логин и пароль",data)
    let base64data = Buffer.from(data).toString('base64');
    const validAuthValue = `Basic ${base64data}`;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader === validAuthValue){
        console.log("базовая авторизация успешна")
        next()
        return
    }
    else res.sendStatus(401)
}