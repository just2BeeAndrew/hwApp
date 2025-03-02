import {UserDBType} from "../types/db.types";
import {WithId} from "mongodb";
import {usersRepository} from "../users/usersRepository";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {bcryptService} from "../application/bcryptService";
import {jwtService} from "../application/jwtService";
import {authRepository} from "./authRepository";
import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";
import {devicesRepository} from "../securityDevices/devicesRepository";

export const authService = {
    async login(loginOrEmail: string, password: string, title: string, ip: string): Promise<Result<{
        accessToken: string,
        refreshToken: string
    } | null>> {
        const credentials = await this.checkCredentials(loginOrEmail, password);
        if (credentials.status !== ResultStatus.Success)
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: "Unauthorized",
                extensions: [{field: "loginOrEmail", message: "Wrong credentials"}],
                data: null
            };

        const userId = credentials.data!._id.toString()

        const sessions = await this.createSessions(userId, title, ip);

        return {
            status: ResultStatus.Success,
            data: {
                accessToken: sessions.accessToken,
                refreshToken: sessions.refreshToken
            },
            extensions: []
        }
    },

    async refreshToken(oldrefreshToken: string, userId: string): Promise<Result<{
        newAccessToken: string,
        newRefreshToken: string
    } | null>> {

        await this.addTokenInBlacklist(oldrefreshToken);
        const deviceId = uuidv4()
        const token = await jwtService.createJWT(userId, deviceId);
        return {
            status: ResultStatus.Success,
            data: {
                newAccessToken: token.accessToken,
                newRefreshToken: token.refreshToken
            },
            extensions: []
        }
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<Result<WithId<UserDBType> | null>> {
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

    async addTokenInBlacklist(refreshToken: string) {
        return await authRepository.addTokenInBlacklist(refreshToken);
    },

    async createSessions(userId: string, title: string, ip: string) {
        const deviceId = new ObjectId();

        const {accessToken, refreshToken} = await jwtService.createJWT(userId, deviceId.toString());

        const {iat, exp} = await jwtService.cutTimeFromRefreshToken(refreshToken);

        const newSession = {
            _id: deviceId,
            userId: userId,
            title: title,
            ip: ip,
            iat: iat,
            exp: exp,
        }

        await devicesRepository.addDevice(newSession);

        return {accessToken, refreshToken}











    }
}