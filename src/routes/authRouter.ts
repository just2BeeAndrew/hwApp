import {Router, Request, Response} from 'express';
import {WithId} from "mongodb";
import {LoginInputType} from "../types/db.types";
import {usersService} from "../domains/usersService";
import {jwtService} from "../application/jwtService";

export const authRouter = Router();

export const authController = {
    async auth (req: Request<LoginInputType>, res: Response) {
        const user = await usersService.checkCredentials(req.body);
        if (!user) {
            res.sendStatus(401);
            return
        }
        const token = await jwtService.createJWT(req.body);
        res.status(204).json(token)
    },
}

authRouter.post('/',authController.auth)

