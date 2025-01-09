import {UserInputType,UserDBType, UserOutputType} from "../types/db.types";
import {WithId} from "mongodb";
import bcrypt from 'bcrypt'

export const usersService = {
    async createUser(createData:UserInputType):Promise<UserOutputType> {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(createData.password,passwordSalt);

        const newUser: UserDBType = {
            id: _id.toString(),
            login: createData.login,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }
        return usersRepository.createUser(newUser);
    },

    async _generateHash(password:string, salt:string) {
        const hash = await bcrypt.hash(password, salt);
        return hash;
        //!!!Завершить проверку ХЭШ!!!
    },
}