import {Router,Request,Response} from "express";
import {usersService} from "../domains/usersService";

export const userRouter = Router();

export const userController = {
    async getAllUsers(){

    },

    async createUser(){
        const user = await usersService.createUser()

    },

    async deleteUser(){

    }
}

userRouter.get('/',userController.getAllUsers);
userRouter.post('/',userController.createUser);
userRouter.delete('/:id',userController.deleteUser);