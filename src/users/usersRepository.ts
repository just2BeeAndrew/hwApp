import {UserDBType, UserInputType} from "../types/db.types";
import {usersCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";

export const  usersRepository = {
    async getUserBy_Id(_id: string){
      const  object_id = new ObjectId(_id);
      const user = await usersCollection.findOne(object_id);
      if(!user){
          return null;
      }
      return user;
    },

    async createUser(newUser: UserDBType): Promise<string> {
        const user = await usersCollection.insertOne(newUser)
        return user.insertedId.toString();
    },

    async checkLoginUser(login: string) {
        const isLoginTaken = await usersCollection.findOne({login: login});
        if (isLoginTaken) {
            return true
        }
        return false;
    },

    async checkEmailUser(email: string) {
        const isLoginTaken = await usersCollection.findOne({email: email});
        if (isLoginTaken) {
            return true
        }
        return false;
    },

    async findByLoginOrEmail(loginOrEmail:string){
        const user = await usersCollection.findOne({$or:[{email:loginOrEmail}, {login:loginOrEmail}]});
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
    },

    async doesExistById(userId:string):Promise<boolean>{
        if(!this.checkObjectId(userId)) return false;
        const isUser = await usersCollection.findOne({_id: new ObjectId(userId)});
        return !!isUser;
    },

    checkObjectId(userId:string):boolean{
        return ObjectId.isValid(userId)
    }
}