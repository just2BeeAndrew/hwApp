import {Router, Request, Response} from 'express';
import {LoginInputType} from "../types/db.types";
import {usersService} from "../domains/usersService";

export const authRouter = Router();

export const authController = {
    async auth (req: Request<LoginInputType>, res: Response) {
        const auth = await usersService.checkCredentials(req.body);
        if (!auth) {
            res.sendStatus(401);
            return
        }
        res.sendStatus(204)
    },
}

authRouter.post('/',authController.auth)

