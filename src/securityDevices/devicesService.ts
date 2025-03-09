import {devicesCollection} from "../db/mongoDb";
import {devicesRepository} from "./devicesRepository";
import {ObjectId} from "mongodb";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";

class DevicesService {
    async terminateOtherSessions(userId: string, deviceId: string) {
        await devicesRepository.terminateOtherSessions(userId, deviceId);
    }

    async deleteSessionsById(deviceId: string, userId: string): Promise<Result<boolean>> {
        const device = await devicesCollection.findOne({_id: new ObjectId(deviceId)});
        if (!device) {
            return {
                status: ResultStatus.NotFound,
                errorMessage: "No device found",
                extensions: [{field: "sessions", message: "No session found."}],
                data: false
            }
        }
        if (device.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                errorMessage: "not owner",
                extensions: [{field: "userId", message: "Not owner",}],
                data: false
            }
        }
        const result = await devicesRepository.deleteSessionsById(deviceId);
        if (result) {
            return {
                status: ResultStatus.NoContent,
                extensions: [],
                data: true
            }
        }
        return {
            status: ResultStatus.ServerError,
            errorMessage: "Server Error",
            extensions: [{field: "session", message: "isnt deleted"}],
            data: false
        }
    }
}

export const devicesService = new DevicesService();