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

export const userRouter = Router();

export const userController = {
    async getAllUsers(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const users = await usersQueryRepository.getAllUsers(sortData)
        res.status(200).json(users)
    },

    async createUser(req: Request<UserInputType>, res: Response) {
        const {login, password, email} = req.body
        const newUserId = await usersService.createUser(login, password, email);
        if (newUserId.status !== ResultStatus.Success) {
             res.status(HttpStatuses.BAD_REQUEST)
             return;
         }
        const user = await usersQueryRepository.getUserBy_Id(newUserId.data!.createdUser);
        res.status(201).json(user);
    },

    async deleteUser(req: Request, res: Response){
        const deleteUser = await usersService.deleteUser(req.params.id);
        if(deleteUser){
            res.sendStatus(204)
            return;
        }
        res.sendStatus(404)
    },
}

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