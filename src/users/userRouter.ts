import {Router,Request,Response} from "express";
import {usersService} from "./usersService";
import {UserInputType} from "../types/db.types";
import {paginationQueries} from "../helpers/paginationValues";
import {usersQueryRepository} from "./usersQueryRepository";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {loginValidator, passwordValidator, emailValidator} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {HttpStatuses} from "../types/httpStatuses";
import {ResultStatus} from "../result/resultCode";
import {RequestWithBody} from "../types/requests";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";

export const userRouter = Router();

class UsersController {
    async getAllUsers(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const users = await usersQueryRepository.getAllUsers(sortData)
        res.status(HttpStatuses.SUCCESS).json(users)
    }

    async createUser(req: RequestWithBody<UserInputType>, res: Response) {
        const {login, password, email} = req.body
        const newUserId = await usersService.createUser(login, password, email);
        if (newUserId.status !== ResultStatus.Success) {
            res.sendStatus(resultCodeToHttpException(newUserId.status))
            return;
        }
        const user = await usersQueryRepository.getUserBy_Id(newUserId.data!.createdUser);
        res.status(201).json(user);
    }

    async deleteUser(req: Request, res: Response){
        const deleteUser = await usersService.deleteUser(req.params.id);
        if(deleteUser){
            res.sendStatus(HttpStatuses.NOCONTENT)
            return;
        }
        res.sendStatus(HttpStatuses.NOT_FOUND)
    }
}

export const userController = new UsersController()

userRouter.get('/',
    authorizationMiddleware,
    errorsResultMiddleware,
    userController.getAllUsers);
userRouter.post('/',
    authorizationMiddleware,
    loginValidator,
    passwordValidator,
    emailValidator,
    errorsResultMiddleware,
    userController.createUser);
userRouter.delete('/:id',
    authorizationMiddleware,
    errorsResultMiddleware,
    userController.deleteUser);