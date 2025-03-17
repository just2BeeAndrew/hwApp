import {UserDBType} from "../types/db.types";
import {UserModel} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async getUserBy_Id(_id: string): Promise<WithId<UserDBType> | null> {
        return await UserModel.findOne({_id: new ObjectId(_id)}) || null;
    }

    async createUser(newUser: UserDBType): Promise<string> {
        const user = await UserModel.create(newUser)
        return user._id.toString();
    }

    async checkLoginUser(login: string) {
        const isLoginTaken = await UserModel.findOne({'accountData.login': login});
        if (isLoginTaken) {
            return true
        }
        return false;
    }

    async checkEmailUser(email: string) {
        const isEmailTaken = await UserModel.findOne({"accountData.email": email});
        if (isEmailTaken) {
            return true
        }
        return false;
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        return await UserModel.findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]});
    }

    async findUserByConfirmationCode(confirmCode: string) {
        return await UserModel.findOne({"emailConfirmation.confirmationCode": confirmCode});
    }

    async findUserByRecoveryCode(recoveryCode: string) {
        return await UserModel.findOne({'emailConfirmation.recoveryCode': recoveryCode});
    }

    async updateConfirmation(_id: ObjectId, isConfirm: boolean): Promise<boolean> {
        let result = await UserModel.updateOne({_id}, {$set: {'emailConfirmation.isConfirm': isConfirm}});
        return result.modifiedCount === 1
    }

    async updateConfirmCode(email: string, confirmCode: string): Promise<boolean> {
        let result = await UserModel.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.confirmationCode': confirmCode}});
        return result.modifiedCount === 1
    }

    async updateRecoveryCode(email: string, recoveryCode: string) {
        const result = await UserModel.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.recoveryCode': recoveryCode}})
        return result.modifiedCount === 1
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await UserModel.findOne({_id: new ObjectId(id)});
        if (user) {
            const res = await UserModel.deleteOne({_id: user._id});
            if (res.deletedCount > 0) return true;
        }
        return false;
    }

    async doesExistById(userId: string): Promise<boolean> {
        if (!this.checkObjectId(userId)) return false;
        const isUser = await UserModel.findOne({_id: new ObjectId(userId)});
        return !!isUser;
    }

    async updatePassword(userId: ObjectId, newPassword: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            {_id: userId},
            {$set: {"accountData.passwordHash": newPassword, "emailConfirmation.recoveryCode": null}},
        )
        return result.modifiedCount === 1
    }

    checkObjectId(userId: string): boolean {
        return ObjectId.isValid(userId)
    }
}