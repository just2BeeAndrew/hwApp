import {UserDBType} from "../types/db.types";
import {usersCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";

export const  usersRepository = {
    async createUser(newUser: UserDBType): Promise<string> {
        const user = await usersCollection.insertOne(newUser)
        return user.insertedId.toString();
    },

    async findByLoginOrEmail(loginOrEmail:string){
        const user = await usersCollection.findOne({$or:[{email:loginOrEmail}, {userName:loginOrEmail}]});
        return user;
    },

    async deleteUser(id:string):Promise<boolean>{
        const object_Id = new ObjectId(id)
        const user = await usersCollection.findOne({_id:object_Id});
        if (user) {
            const res = await usersCollection.deleteOne({_id: user._id});
            if (res.deletedCount > 0) return true;
        }
        return false;
    }
}