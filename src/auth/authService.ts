import {UserDBType} from "../types/db.types";
import {WithId} from "mongodb";
import {usersRepository} from "../users/usersRepository";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {bcryptService} from "../application/bcryptService";
import {jwtService} from "../application/jwtService";
import {authRepository} from "./authRepository";
import {ObjectId} from "mongodb";
import {devicesRepository} from "../securityDevices/devicesRepository";
import {devicesCollection} from "../db/mongoDb";
import exp from "node:constants";

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

    async refreshToken(userId: string, deviceId: string): Promise<Result<{
        newAccessToken: string,
        newRefreshToken: string
    } | null>> {

        const sessions = await this.updateSessions(userId, deviceId);

        return {
            status: ResultStatus.Success,
            data: {
                newAccessToken: sessions.accessToken,
                newRefreshToken: sessions.refreshToken
            },
            extensions: []
        }
    },

    async logout(userId: string, deviceId: string) {
        await devicesRepository.logout(userId, deviceId);
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
    },

    async updateSessions(userId: string, deviceId: string) {

        const {accessToken, refreshToken} = await jwtService.createJWT(userId, deviceId);

        const payload = await jwtService.verifyRefreshToken(refreshToken);
        //!!! уточнить на саппорте
        await devicesRepository.updateDevice(payload!.iat, payload!.exp, deviceId);

        return {accessToken, refreshToken}

    }
}