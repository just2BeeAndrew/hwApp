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
import {emailValidator, loginValidator, passwordValidator} from "../middlewares/expressValidationMiddleware";
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {ipRateLimitMiddleware} from "../middlewares/ipRateLimitMiddleware";

export const authRouter = Router();

export const authController = {
    async login(req: RequestWithBody<LoginInputType>, res: Response) {
        const {loginOrEmail, password} = req.body
        const title = req.headers['user-agent']
        if (!title){
            res.status(HttpStatuses.NOT_FOUND)
            return
        }
        const ip = req.ip
        if (!ip){
            res.status(HttpStatuses.SERVER_ERROR)
            return
        }
        const result = await authService.login(loginOrEmail, password, title, ip);
        // if (!result.data) {
        //     res.sendStatus(HttpStatuses.SERVER_ERROR);
        //     return
        // }
        if (result.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(result.status))
                .send(result.extensions)
            return
        }
        const {accessToken, refreshToken} = result.data!
        res
            .cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            .status(HttpStatuses.SUCCESS)
            .json({accessToken: accessToken})
    },

    async refreshToken(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const deviceId = req.device?.deviceId as string;
        const result = await authService.refreshToken( userId, deviceId);
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
        const {newAccessToken, newRefreshToken} = result.data!
        res
            .cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
            .status(HttpStatuses.SUCCESS)
            .json({accessToken: newAccessToken})
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
        const createdUserId = await usersService.createUser(login, password, email);
        if (createdUserId.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(createdUserId.status))
                .send({errorsMessages: createdUserId.extensions})
            return
        }

        const userId = createdUserId.data!.createdUser
//перенести в сервис
        const registration = await usersService.registration(userId)

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
        const userId = req.user?.id as string;
        const deviceId = req.device?.deviceId as string;
        await authService.logout(userId, deviceId)
        res
            .clearCookie('refreshToken', {httpOnly: true, secure: true})
            .sendStatus(HttpStatuses.NOCONTENT)
    },

    async infoUser(req: Request, res: Response) {
        const info = await usersQueryRepository.getInfoBy_Id(req.user!.id);
        res.status(HttpStatuses.SUCCESS).json(info)
    }
}

authRouter.post('/login',
    ipRateLimitMiddleware,
    errorsResultMiddleware,
    authController.login)
authRouter.post('/refresh-token',
    refreshTokenMiddleware,
    errorsResultMiddleware,
    authController.refreshToken)
authRouter.post('/registration-confirmation',
    ipRateLimitMiddleware,
    errorsResultMiddleware,
    authController.registrationConfirmation)
authRouter.post('/registration',
    ipRateLimitMiddleware,
    loginValidator,
    passwordValidator,
    emailValidator,
    errorsResultMiddleware,
    authController.registration)
authRouter.post('/registration-email-resending',
    ipRateLimitMiddleware,
    emailValidator,
    errorsResultMiddleware,
    authController.registrationEmailResending)
authRouter.post('/logout',
    ipRateLimitMiddleware,
    refreshTokenMiddleware,
    errorsResultMiddleware,
    authController.logout)
authRouter.get('/me',
    accessTokenMiddleware,
    errorsResultMiddleware,
    authController.infoUser)

