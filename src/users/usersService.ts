import {LoginInputType, UserDBType, UserInputType} from "../types/db.types";
import {WithId} from "mongodb";
import bcrypt from 'bcrypt'
import {usersRepository} from "./usersRepository";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {bcryptService} from "../application/bcryptService";

export const usersService = {
    async createUser(createData: UserInputType)/*:Promise<string | { errorsMessages: { field: string; message: string }[] } >*/ {
        const isLoginTaken = await usersRepository.checkLoginUser(createData.login);
        if (isLoginTaken) {
            return {
                errorsMessages: [{field: 'login', message: 'login should be unique'}],
            };
        }
        const isEmailTaken = await usersRepository.checkEmailUser(createData.email);
        if (isEmailTaken) {
            return {
                errorsMessages: [{field: 'email', message: 'email should be unique'}],
            };
        }
        const passwordHash = await bcryptService.generateHash(createData.password);

        const newUser: UserDBType = {
            login: createData.login,
            passwordHash,
            email: createData.email,
            createdAt: new Date().toISOString()
        }
        const createdUser = await usersRepository.createUser(newUser)
        return createdUser;
    },



    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    }
}