import {Router, Request, Response, Application} from 'express';
import {WithId} from "mongodb";
import {LoginInputType} from "../types/db.types";
import {usersService} from "../users/usersService";
import {jwtService} from "../application/jwtService";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {usersQueryRepository} from "../users/usersQueryRepository";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {authService} from "./authService";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";

export const authRouter = Router();

export const authController = {
    async loginUser(req: Request<{}, {}, LoginInputType>, res: Response) {
        const user = await authService.loginUser(req.body);
        if (user.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(user.status))
                .send(user.extensions)
            return
        }

        res
            .status(HttpStatuses.SUCCESS)
            .json({accessToken: user.data!.accessToken})
    },

    async infoUser(req: Request, res: Response) {
        const info = await usersQueryRepository.getInfoBy_Id(req.user!.id);
        res.status(HttpStatuses.SUCCESS).json(info)
    }
}

authRouter.post('/login', authController.loginUser)
authRouter.get('/me', authorizationMiddleware, authController.infoUser)

