import {Router,Request,Response} from "express";
import {usersService} from "../domains/usersService";
import {UserInputType} from "../types/db.types";

export const userRouter = Router();

export const userController = {
    async getAllUsers(){

    },

    async createUser(req: Request<UserInputType>, res: Response){
        const newUser = await usersService.createUser(req.body);
        res.status(201).json(newUser);
    },

    async deleteUser(){

    },
}

userRouter.get('/',userController.getAllUsers);
userRouter.post('/',userController.createUser);
userRouter.delete('/:id',userController.deleteUser);