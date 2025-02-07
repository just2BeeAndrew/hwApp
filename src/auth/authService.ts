import {UserAccountDBType} from "../types/db.types";
import {WithId} from "mongodb";
import {usersRepository} from "../users/usersRepository";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {bcryptService} from "../application/bcryptService";
import {jwtService} from "../application/jwtService";

export const authService = {
    async loginUser(loginOrEmail: string, password: string): Promise<Result<{ accessToken: string } | null>> {
        const result = await this.checkCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success)
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: "Unauthorized",
                extensions: [{field: "loginOrEmail", message: "Wrong credentials"}],
                data: null
            };

        const accessToken = await jwtService.createJWT(result.data!._id.toString())

        return {
            status: ResultStatus.Success,
            data: {accessToken},
            extensions: []
        }
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<Result<WithId<UserAccountDBType> | null>> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Not Found",
                extensions: [{field: 'loginOrEmail', message: 'Not Found'}],
            }
        }

        if (!user.emailConfirmation.isConfirm) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'user', message: "user isn't confirmed"}],
                data: null
            }
        }

        const passwordHash = await bcryptService.checkPassword(password, user.accountData.passwordHash)

        if (!passwordHash) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: "Bad Request",
                extensions: [{field: 'password', message: 'Wrong password'}],
            };
        }
        return {
            status: ResultStatus.Success,
            data: user,
            extensions: [],
        }
    },
}