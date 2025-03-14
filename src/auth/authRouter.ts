import {Router} from 'express';
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {emailValidator, loginValidator, passwordValidator} from "../middlewares/expressValidationMiddleware";
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {ipRateLimitMiddleware} from "../middlewares/ipRateLimitMiddleware";
import {container} from "../composition-root";
import {UsersController} from "../users/usersController";
import {AuthController} from "./authController";

const usersController = container.get(UsersController);

export const authRouter = Router();

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

