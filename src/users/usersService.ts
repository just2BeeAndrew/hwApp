import {UserDBType} from "../types/db.types";
import {UsersRepository} from "./usersRepository";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {bcryptService} from "../application/bcryptService";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns"
import {emailManagers} from "../email/manager/emailManager";
import {ObjectId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository)protected usersRepository: UsersRepository) {}

    async createUser(login: string, password: string, email: string): Promise<Result<{ createdUser: string } | null>> {
        const isLoginTaken = await this.usersRepository.checkLoginUser(login);

        if (isLoginTaken) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'login', message: "email isn't send"}],
                data: null
            };
        }

        const isEmailTaken = await this.usersRepository.checkEmailUser(email);

        if (isEmailTaken) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'email', message: "email isn't send"}],
                data: null
            };
        }
        const passwordHash = await bcryptService.generateHash(password);

        const newUser = new UserDBType(
            {
                login: login,
                passwordHash,
                email: email,
                createdAt: new Date().toISOString(),
            },
            {
                confirmationCode: uuidv4(),
                issuedAt: new Date(),
                expirationDate: add(new Date(), {hours: 1}),
                isConfirm: true,
            }
        )

        const createdUser = await this.usersRepository.createUser(newUser)
        return {
            status: ResultStatus.Success,
            extensions: [],
            data: {createdUser}
        }
    }

    async registration(_id: string) {
        const createdUser = await this.usersRepository.getUserBy_Id(_id);
        await this.usersRepository.updateConfirmation(new ObjectId(createdUser!._id), false)
        try {
            emailManagers.sendEmail(createdUser!.accountData.email, createdUser!.emailConfirmation.confirmationCode)
        } catch (error) {
            await this.deleteUser(createdUser!._id.toString())
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'email', message: "email isn't send"}],
                data: null
            }
        }
    }

    async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(id)
    }

    async registrationConfirmation(confirmCode: string): Promise<Result<{ result: boolean } | false>> {
        let user = await this.usersRepository.findUserByConfirmationCode(confirmCode);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Not Found",
                extensions: [{field: 'code', message: 'Not found'}],
                data: false
            }
        }
        if (user.emailConfirmation.isConfirm) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'code', message: 'code already confirm'}],
                data: false
            }
        }
        if (user.emailConfirmation.confirmationCode !== confirmCode) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'code', message: "Invalid code"}],
                data: false
            }
        }
        if (user.emailConfirmation.expirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'code', message: 'invalid code'}],
                data: false
            }
        }
        let result = await this.usersRepository.updateConfirmation(user._id, true)
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: {result}
        }
    }

    async registrationEmailResending(email: string) {
        const user = await this.usersRepository.findByLoginOrEmail(email);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Not Exist",
                extensions: [{field: 'email', message: 'Email not found'}],
                data: null
            };
        }
        if (user.emailConfirmation.isConfirm) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'email', message: 'email already confirm'}],
                data: null
            }
        }

        const code = uuidv4();

        await this.usersRepository.updateConfirmCode(email, code)

        try {
            emailManagers.sendEmail(email, code)
        } catch (error) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: "Bad Request",
                extensions: [{field: 'email', message: "email isn't send"}],
                data: null
            }
        }
        return {
            status: ResultStatus.NoContent,
            extensions: [],
            data: null
        }
    }
}