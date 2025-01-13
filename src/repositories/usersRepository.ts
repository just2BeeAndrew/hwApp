import {UserDBType, UserOutputType} from "../types/db.types";
import {usersCollection} from "../db/mongoDb";
import {WithId} from "mongodb";

const userMapper = (user:WithId<UserDBType>):UserOutputType =>{
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}

export const  usersRepository = {
    async createUser(newUser: UserDBType){
        const user = await usersCollection.insertOne(newUser)
        const userOutput: UserOutputType = userMapper({...newUser, _id: user.insertedId});
        return userOutput;
    },

    async findByLoginOrEmail(loginOrEmail:string){
        const user = await usersCollection.findOne({$or:[{email:loginOrEmail}, {userName:loginOrEmail}]});
        return user;
    }
}