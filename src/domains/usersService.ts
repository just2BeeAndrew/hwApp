import {UserInputType, UserDBType, UserOutputType, LoginInputType} from "../types/db.types";
import {WithId} from "mongodb";
import {ObjectId} from "mongodb";
import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/usersRepository";
import {usersCollection} from "../db/mongoDb";

export const usersService = {
    async createUser(createData:UserInputType)/*:Promise<string | { errorsMessages: { field: string; message: string }[] } >*/ {
        const isLoginTaken = await usersRepository.checkLoginUser(createData.login);
        if (isLoginTaken) {
            return {
                errorsMessages: [{ field: 'login', message: 'login should be unique' }],
            };
        }

        const isEmailTaken = await usersRepository.checkEmailUser(createData.email);
        if (isEmailTaken) {
            return {

            };
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(createData.password,passwordSalt);
        const _id = new ObjectId()

        const newUser: UserDBType = {
            login: createData.login,
            passwordHash,
            passwordSalt,
            email: createData.email,
            createdAt: new Date().toISOString()
        }
        const createdUser = await usersRepository.createUser(newUser)
        return createdUser;
    },

    async checkCredentials(checkData:LoginInputType){
        const user = await usersRepository.findByLoginOrEmail(checkData.loginOrEmail);
        if (!user) return false
        const passwordHash = await this._generateHash(checkData.password, user.passwordSalt);
        if (user.passwordHash !== passwordHash) return false
        return true
    },

    async _generateHash(password:string, salt:string) {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    },

    async deleteUser(id: string){
        return await usersRepository.deleteUser(id)
    }
}