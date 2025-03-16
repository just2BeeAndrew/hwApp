import {UserDBType} from "../types/db.types";
import {usersCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async getUserBy_Id(_id: string): Promise<WithId<UserDBType> | null> {
        return await usersCollection.findOne({_id: new ObjectId(_id)}) || null;
    }

    async createUser(newUser: UserDBType): Promise<string> {
        const user = await usersCollection.insertOne(newUser)
        return user.insertedId.toString();
    }

    async checkLoginUser(login: string) {
        const isLoginTaken = await usersCollection.findOne({'accountData.login': login});
        if (isLoginTaken) {
            return true
        }
        return false;
    }

    async checkEmailUser(email: string) {
        const isEmailTaken = await usersCollection.findOne({"accountData.email": email});
        if (isEmailTaken) {
            return true
        }
        return false;
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        return await usersCollection.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]});
    }

    async findUserByConfirmationCode(confirmCode: string) {
        return await usersCollection.findOne({"emailConfirmation.confirmationCode": confirmCode});
    }

    async findUserByRecoveryCode(recoveryCode: string) {
        return await usersCollection.findOne({'emailConfirmation.recoveryCode': recoveryCode});
    }

    async updateConfirmation(_id: ObjectId, isConfirm: boolean): Promise<boolean> {
        let result = await usersCollection.updateOne({_id}, {$set: {'emailConfirmation.isConfirm': isConfirm}});
        return result.modifiedCount === 1
    }

    async updateConfirmCode(email: string, confirmCode: string): Promise<boolean> {
        let result = await usersCollection.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.confirmationCode': confirmCode}});
        return result.modifiedCount === 1
    }

    async updateRecoveryCode(email: string, recoveryCode: string) {
        const result = await usersCollection.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.recoveryCode': recoveryCode}})
        return result.modifiedCount === 1
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)});
        if (user) {
            const res = await usersCollection.deleteOne({_id: user._id});
            if (res.deletedCount > 0) return true;
        }
        return false;
    }

    async doesExistById(userId: string): Promise<boolean> {
        if (!this.checkObjectId(userId)) return false;
        const isUser = await usersCollection.findOne({_id: new ObjectId(userId)});
        return !!isUser;
    }

    async updatePassword(userId: ObjectId, newPassword: string): Promise<boolean> {
        const result = await usersCollection.updateOne(
            {_id: userId},
            {'accountData.passwordHash': newPassword},
        )
        return result.modifiedCount === 1
    }

    checkObjectId(userId: string): boolean {
        return ObjectId.isValid(userId)
    }
}