import {Router, Request, Response} from 'express';
import {WithId} from "mongodb";
import {LoginInputType} from "../types/db.types";
import {usersService} from "../users/usersService";
import {jwtService} from "../application/jwtService";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {usersQueryRepository} from "../users/usersQueryRepository";

export const authRouter = Router();

export const authController = {
    async loginUser (req: Request<LoginInputType>, res: Response) {
        const user = await usersService.checkCredentials(req.body);
        if (!user) {
            res.sendStatus(401);
            return
        }
        const accessToken = await jwtService.createJWT(req.body);
        res.status(204).json(accessToken)
    },

    async infoUser (req: Request, res: Response) {
        const info = await usersQueryRepository.getUserBy_Id(req.user!.id);
        res.status(200).json(info)
    }
}

authRouter.post('/login',authController.loginUser)
authRouter.get('/me',authorizationMiddleware, authController.infoUser)

