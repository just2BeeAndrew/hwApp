import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {emailValidator, loginValidator, passwordValidator} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {container} from "../composition-root";
import {UsersController} from "./usersController";


//const usersController = ioc.getInstance<UsersController>(UsersController)
const usersController = container.get(UsersController);

export const userRouter = Router();

userRouter.get('/',
    authorizationMiddleware,
    errorsResultMiddleware,
    usersController.getAllUsers.bind(usersController));
userRouter.post('/',
    authorizationMiddleware,
    loginValidator,
    passwordValidator,
    emailValidator,
    errorsResultMiddleware,
    usersController.createUser.bind(usersController));
userRouter.delete('/:id',
    authorizationMiddleware,
    errorsResultMiddleware,
    usersController.deleteUser.bind(usersController));