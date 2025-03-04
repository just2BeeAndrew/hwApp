import {devicesCollection} from "../db/mongoDb";
import {devicesRepository} from "./devicesRepository";


export const devicesService = {
    async terminateOtherSessions(userId:string,deviceId:string) {
        await devicesRepository.terminateOtherSessions(userId, deviceId);
    },

    async deleteSessionsById(deviceId:string) {
        await devicesRepository.deleteSessionsById(deviceId);
    }
}