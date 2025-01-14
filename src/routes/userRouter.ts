import {Router,Request,Response} from "express";
import {usersService} from "../domains/usersService";
import {UserInputType} from "../types/db.types";
import {paginationQueries} from "../helpers/paginationValues";
import {usersQueryRepository} from "../repositories/usersQueryRepository";

export const userRouter = Router();

export const userController = {
    async getAllUsers(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const users = await usersQueryRepository.getAllUsers(sortData)
        res.status(200).json(users)
    },

    async createUser(req: Request<UserInputType>, res: Response){
        const newUserId = await usersService.createUser(req.body);
        const user = await usersQueryRepository.getUserBy_Id(newUserId);
        res.status(201).json(newUserId);
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

userRouter.get('/',userController.getAllUsers);
userRouter.post('/',userController.createUser);
userRouter.delete('/:id',userController.deleteUser);