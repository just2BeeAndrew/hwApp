import {Router, Request, Response} from 'express';
import {LoginInputType, RegistrationConfirmationCode, UserInputType} from "../types/db.types";
import {usersQueryRepository} from "../users/usersQueryRepository";
import {ResultStatus} from "../result/resultCode";
import {authService} from "./authService";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {RequestWithBody} from "../types/requests";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {usersService} from "../users/usersService";

export const authRouter = Router();

export const authController = {
    async loginUser(req: RequestWithBody<LoginInputType>, res: Response) {
        const {loginOrEmail, password} = req.body
        const user = await authService.loginUser(loginOrEmail, password);
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

    async registrationConfirmation(req: RequestWithBody<RegistrationConfirmationCode>, res: Response) {
        const {code} = req.body
        const result = await usersService.registrationConfirmation(code);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(result.status))
                .send(result.extensions)
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    },

    async registration(req: RequestWithBody<UserInputType>, res: Response) {
        const {login, password, email} = req.body
        const user = await usersService.createUser(login, password, email);
        if (user.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(user.status))
        }
        res.sendStatus(HttpStatuses.SUCCESS)

    },

    async registrationEmailResending(req: Request, res: Response) {

    },

    async infoUser(req: Request, res: Response) {
        const info = await usersQueryRepository.getInfoBy_Id(req.user!.id);
        res.status(HttpStatuses.SUCCESS).json(info)
    }
}

authRouter.post('/login', authController.loginUser)
authRouter.post('/registration-confirmation', authController.registrationConfirmation)
authRouter.post('/registration', authController.registration)
authRouter.post('/registration-email-resending', authController.registrationEmailResending)
authRouter.get('/me',
    accessTokenMiddleware,
    errorsResultMiddleware,
    authController.infoUser)

