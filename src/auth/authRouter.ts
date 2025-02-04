import {Router, Request, Response} from 'express';
import {LoginInputType} from "../types/db.types";
import {usersQueryRepository} from "../users/usersQueryRepository";
import {ResultStatus} from "../result/resultCode";
import {authService} from "./authService";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {RequestWithBody} from "../types/requests";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import nodemailer from 'nodemailer'

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

    async confirmReg(req: Request, res: Response) {


    },

    async sendConfirmEmail(req: Request, res: Response) {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "andrew.dudal.1997@gmail.com",
                pass: "bwxyzxbcfadxrmml",//bwxy zxbc fadx rmml
            },
        });

// Отправка письма
        let info = await transport.sendMail({
            from: 'andrew.dudal.1997@gmail.com',
            to: req.body.email,
            subject: 'Тестовое письмо через Gmail',
            text: 'Привет, это тестовое письмо, отправленное через Nodemailer'
        });
        console.log(info);
        res.sendStatus(HttpStatuses.SUCCESS);
    },

    async resendConfirmEmail(req: Request, res: Response) {

    },

    async infoUser(req: Request, res: Response) {
        const info = await usersQueryRepository.getInfoBy_Id(req.user!.id);
        res.status(HttpStatuses.SUCCESS).json(info)
    }
}

authRouter.post('/login', authController.loginUser)
authRouter.post('/registration-confirmation', authController.confirmReg)
authRouter.post('/registration', authController.sendConfirmEmail)
authRouter.post('/registration-email-resending', authController.resendConfirmEmail)
authRouter.get('/me',
    accessTokenMiddleware,
    errorsResultMiddleware,
    authController.infoUser)

