import {UsersService} from "./usersService";
import {Request, Response} from "express";
import {paginationQueries} from "../helpers/paginationValues";
import {usersQueryRepository} from "./usersQueryRepository";
import {HttpStatuses} from "../types/httpStatuses";
import {RequestWithBody} from "../types/requests";
import {UserInputType} from "../types/db.types";
import {ResultStatus} from "../result/resultCode";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";

export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getAllUsers(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const users = await usersQueryRepository.getAllUsers(sortData)
        res.status(HttpStatuses.SUCCESS).json(users)
    }

    async createUser(req: RequestWithBody<UserInputType>, res: Response) {
        const {login, password, email} = req.body
        const newUserId = await this.usersService.createUser(login, password, email);
        if (newUserId.status !== ResultStatus.Success) {
            res.sendStatus(resultCodeToHttpException(newUserId.status))
            return;
        }
        const user = await usersQueryRepository.getUserBy_Id(newUserId.data!.createdUser);
        res.status(201).json(user);
    }

    async deleteUser(req: Request, res: Response) {
        const deleteUser = await this.usersService.deleteUser(req.params.id);
        if (deleteUser) {
            res.sendStatus(HttpStatuses.NOCONTENT)
            return;
        }
        res.sendStatus(HttpStatuses.NOT_FOUND)
    }
}