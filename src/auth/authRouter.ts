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
import {ipTrackerMiddleware} from "../middlewares/ipTrackerMiddleware";
import {emailValidator, loginValidator, passwordValidator} from "../middlewares/expressValidationMiddleware";
import {jwtService} from "../application/jwtService";
import {SETTINGS} from "../settings";
import jwt from "jsonwebtoken";

export const authRouter = Router();

export const authController = {
    async login(req: RequestWithBody<LoginInputType>, res: Response) {
        const {loginOrEmail, password} = req.body
        const result = await authService.login(loginOrEmail, password);
        if (!result.data) {
            res.sendStatus(HttpStatuses.SERVER_ERROR);
            return
        }
        if (result.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(result.status))
                .send(result.extensions)
            return
        }
        const {accessToken, refreshToken} = result.data!
        res
            .cookie('jwt', refreshToken, {httpOnly: true, secure: true})
            .status(HttpStatuses.SUCCESS)
            .json({accessToken: accessToken})
    },

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.jwt;
        const payload = await jwtService.verifyToken(refreshToken, SETTINGS.REFRESH_TOKEN_SECRET);
    },

    async registrationConfirmation(req: RequestWithBody<RegistrationConfirmationCode>, res: Response) {
        const {code} = req.body
        const result = await usersService.registrationConfirmation(code);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(result.status))
                .send({errorsMessages: result.extensions})
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    },

    async registration(req: RequestWithBody<UserInputType>, res: Response) {
        const {login, password, email} = req.body
        const isConfirm = false
        const user = await usersService.createUser(login, password, email, isConfirm);

        if (user.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(user.status))
                .send({errorsMessages: user.extensions})
            return
        }

        res.sendStatus(HttpStatuses.NOCONTENT)

    },

    async registrationEmailResending(req: RequestWithBody<UserInputType>, res: Response) {
        const {email} = req.body
        const user = await usersService.registrationEmailResending(email)
        if (user.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(user.status))
                .send({errorsMessages: user.extensions})
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    },

    async logout(req: Request, res: Response) {

    },

    async infoUser(req: Request, res: Response) {
        const info = await usersQueryRepository.getInfoBy_Id(req.user!.id);
        res.status(HttpStatuses.SUCCESS).json(info)
    }
}

authRouter.post('/login', authController.login)
authRouter.post('/refresh-token', authController.refreshToken)
authRouter.post('/registration-confirmation', authController.registrationConfirmation)
authRouter.post('/registration',
    loginValidator,
    passwordValidator,
    emailValidator,
    errorsResultMiddleware,
    authController.registration)
authRouter.post('/registration-email-resending',
    ipTrackerMiddleware,
    emailValidator,
    errorsResultMiddleware,
    authController.registrationEmailResending)
authRouter.post('/logout', authController.logout)
authRouter.get('/me',
    accessTokenMiddleware,
    errorsResultMiddleware,
    authController.infoUser)

