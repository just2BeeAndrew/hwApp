import {UserDBType} from "../types/db.types";
import {UserModelClass} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async getUserBy_Id(_id: string): Promise<WithId<UserDBType> | null> {
        return await UserModelClass.findOne({_id: new ObjectId(_id)}) || null;
    }

    async createUser(newUser: UserDBType): Promise<string> {
        const user = await UserModelClass.create(newUser)
        return user._id.toString();
    }

    async checkLoginUser(login: string) {
        const isLoginTaken = await UserModelClass.findOne({'accountData.login': login});
        if (isLoginTaken) {
            return true
        }
        return false;
    }

    async checkEmailUser(email: string) {
        const isEmailTaken = await UserModelClass.findOne({"accountData.email": email});
        if (isEmailTaken) {
            return true
        }
        return false;
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        return UserModelClass
            .findOne({$or: [{'accountData.email': loginOrEmail}, {'accountData.login': loginOrEmail}]})
            .lean();
    }

    async findUserByConfirmationCode(confirmCode: string) {
        return UserModelClass.findOne({"emailConfirmation.confirmationCode": confirmCode}).lean();
    }

    async findUserByRecoveryCode(recoveryCode: string) {
        return UserModelClass.findOne({'emailConfirmation.recoveryCode': recoveryCode}).lean();
    }

    async updateConfirmation(_id: ObjectId, isConfirm: boolean): Promise<boolean> {
        const codeInstance = await UserModelClass.findOne({_id: _id})
        if (!codeInstance) return false;

        codeInstance.emailConfirmation.isConfirm = isConfirm;
        await codeInstance.save()

        //let result = await UserModelClass.updateOne({_id}, {$set: {'emailConfirmation.isConfirm': isConfirm}});
        return true
    }

    async updateConfirmCode(email: string, confirmCode: string): Promise<boolean> {
        let result = await UserModelClass.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.confirmationCode': confirmCode}});
        return result.modifiedCount === 1
    }

    async updateRecoveryCode(email: string, recoveryCode: string) {
        const result = await UserModelClass.updateOne({'accountData.email': email}, {$set: {'emailConfirmation.recoveryCode': recoveryCode}})
        return result.modifiedCount === 1
    }

    async deleteUser(id: string): Promise<boolean> {
        const userInstance = await UserModelClass.findOne({_id: new ObjectId(id)});
        if (userInstance) {
            await userInstance.deleteOne({_id: new ObjectId(id)});
            return true;
        }
        return false;
    }

    async doesExistById(userId: string): Promise<boolean> {
        if (!this.checkObjectId(userId)) return false;
        const isUser = await UserModelClass.findOne({_id: new ObjectId(userId)});
        return !!isUser;
    }

    async updatePassword(userId: ObjectId, newPassword: string): Promise<boolean> {
        const result = await UserModelClass.updateOne(
            {_id: userId},
            {$set: {"accountData.passwordHash": newPassword, "emailConfirmation.recoveryCode": null}},
        )
        return result.modifiedCount === 1
    }

    checkObjectId(userId: string): boolean {
        return ObjectId.isValid(userId)
    }
}