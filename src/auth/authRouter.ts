import {Router} from 'express';
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {
    emailValidator,
    loginValidator,
    newPasswordValidator,
    passwordValidator, recoveryCodeValidator
} from "../middlewares/expressValidationMiddleware";
import {refreshTokenMiddleware} from "../middlewares/refreshTokenMiddleware";
import {ipRateLimitMiddleware} from "../middlewares/ipRateLimitMiddleware";
import {container} from "../composition-root";
import {AuthController} from "./authController";

const authController = container.get(AuthController);

export const authRouter = Router();

authRouter.post('/login',
    ipRateLimitMiddleware,
    errorsResultMiddleware,
    authController.login.bind(authController))
authRouter.post('/password-recovery',
    emailValidator,
    ipRateLimitMiddleware,
    errorsResultMiddleware,
    authController.passwordRecovery.bind(authController))
authRouter.post('/new-password',
    recoveryCodeValidator,
    newPasswordValidator,
    ipRateLimitMiddleware,
    errorsResultMiddleware,
    authController.confirmPasswordRecovery.bind(authController))
authRouter.post('/refresh-token',
    refreshTokenMiddleware,
    errorsResultMiddleware,
    authController.refreshToken.bind(authController))
authRouter.post('/registration-confirmation',
    ipRateLimitMiddleware,
    errorsResultMiddleware,
    authController.registrationConfirmation.bind(authController))
authRouter.post('/registration',
    ipRateLimitMiddleware,
    loginValidator,
    passwordValidator,
    emailValidator,
    errorsResultMiddleware,
    authController.registration.bind(authController))
authRouter.post('/registration-email-resending',
    ipRateLimitMiddleware,
    emailValidator,
    errorsResultMiddleware,
    authController.registrationEmailResending.bind(authController))
authRouter.post('/logout',
    ipRateLimitMiddleware,
    refreshTokenMiddleware,
    errorsResultMiddleware,
    authController.logout.bind(authController))
authRouter.get('/me',
    accessTokenMiddleware,
    errorsResultMiddleware,
    authController.infoUser.bind(authController))

