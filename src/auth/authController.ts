import {inject, injectable} from "inversify";
import {UsersService} from "../users/usersService";
import {RequestWithBody} from "../types/requests";
import {ConfirmPasswordType, LoginInputType, RegistrationConfirmationCode, UserInputType} from "../types/db.types";
import {Request, Response} from "express";
import {HttpStatuses} from "../types/httpStatuses";
import {AuthService} from "./authService";
import {ResultStatus} from "../result/resultCode";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {usersQueryRepository} from "../users/usersQueryRepository";

@injectable()
export class AuthController {
    constructor(
        @inject(UsersService) protected usersService: UsersService,
        @inject(AuthService) protected authService: AuthService,
    ) {
    }

    async login(req: RequestWithBody<LoginInputType>, res: Response) {
        const {loginOrEmail, password} = req.body
        const title = req.headers['user-agent']
        if (!title) {
            res.status(HttpStatuses.NOT_FOUND)
            return
        }
        const ip = req.ip
        if (!ip) {
            res.status(HttpStatuses.SERVER_ERROR)
            return
        }
        const result = await this.authService.login(loginOrEmail, password, title, ip);
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
    }

    async passwordRecovery(req: RequestWithBody<{ email: string }>, res: Response) {
        const {email} = req.body
        const result = await this.usersService.passwordRecovery(email)
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(result.status))
                .json(result.extensions)
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)

    }

    async confirmPasswordRecovery(req: RequestWithBody<ConfirmPasswordType>, res: Response) {
        const {newPassword, recoveryCode} = req.body
        const result = await this.usersService.confirmPasswordRecovery(newPassword, recoveryCode)
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(result.status))
                .json({errorsMessages:result.extensions})
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async refreshToken(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const deviceId = req.device?.deviceId as string;
        const result = await this.authService.refreshToken(userId, deviceId);
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
    }

    async registrationConfirmation(req: RequestWithBody<RegistrationConfirmationCode>, res: Response) {
        const {code} = req.body
        const result = await this.usersService.registrationConfirmation(code);
        if (result.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(result.status))
                .send({errorsMessages: result.extensions})
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async registration(req: RequestWithBody<UserInputType>, res: Response) {
        const {login, password, email} = req.body
        const createdUserId = await this.usersService.createUser(login, password, email);
        if (createdUserId.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(createdUserId.status))
                .send({errorsMessages: createdUserId.extensions})
            return
        }

        const userId = createdUserId.data!.createdUser
//перенести в сервис
        await this.usersService.registration(userId)
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async registrationEmailResending(req: RequestWithBody<UserInputType>, res: Response) {
        const {email} = req.body
        const user = await this.usersService.registrationEmailResending(email)
        if (user.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(user.status))
                .send({errorsMessages: user.extensions})
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async logout(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const deviceId = req.device?.deviceId as string;
        await this.authService.logout(userId, deviceId)
        res
            .clearCookie('refreshToken', {httpOnly: true, secure: true})
            .sendStatus(HttpStatuses.NOCONTENT)
    }

//проверить репозиторий
    async infoUser(req: Request, res: Response) {
        const info = await usersQueryRepository.getInfoBy_Id(req.user!.id);
        res.status(HttpStatuses.SUCCESS).json(info)
    }
}