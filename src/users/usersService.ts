import {UserDBType} from "../types/db.types";
import {usersRepository} from "./usersRepository";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {bcryptService} from "../application/bcryptService";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns"
import {emailManagers} from "../email/manager/emailManager";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<Result<{createdUser:string} | null>>
    {
        const isLoginTaken = await usersRepository.checkLoginUser(login);
        if (isLoginTaken) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'login', message: 'login should be unique'}],
                data: null
            };
        }
        const isEmailTaken = await usersRepository.checkEmailUser(email);
        if (isEmailTaken) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'email', message: 'email should be unique'}],
                data: null
            };
        }
        const passwordHash = await bcryptService.generateHash(password);

        const newUser: UserDBType = {
            accountData: {
                login: login,
                passwordHash,
                email: email,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1}),
                isConfirm: false,
            }
        }
        const createdUser = await usersRepository.createUser(newUser)
        try {
            await emailManagers.sendEmailRegistration(newUser.accountData.email, newUser.emailConfirmation.confirmationCode )
        } catch (error) {
            await this.deleteUser(createdUser)
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'email', message: "email isn't send"}],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {createdUser}
        }
    },


    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },

    async registrationConfirmation(confirmCode: string):Promise<Result<{result:boolean} | false>> {
        let user = await usersRepository.findUserByConfirmationCode(confirmCode);
        if (!user) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "Not Found",
                extensions: [{field: 'user', message: 'Not found'}],
                data: false
            }
        }
        if (user.emailConfirmation.isConfirm) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'user', message: 'user already confirm'}],
                data: false
            }
        }
        if (user.emailConfirmation.confirmationCode !== confirmCode) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'confirmCode', message: "Invalid code"}],
                data: false
            }
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'confirmationCode', message: 'invalid code'}],
                data: false
            }
        }
        let result = await usersRepository.updateConfirmation(user._id)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: {result}
        }
    }
}