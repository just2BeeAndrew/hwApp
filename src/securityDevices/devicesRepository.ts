import {DevicesDBType} from "../types/db.types";
import {devicesCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";

export const devicesRepository = {
    async addDevice(device: DevicesDBType) {
        await devicesCollection.insertOne(device);
    },

    async updateDevice(newIat: number, newExp: number, deviceId: string) {
        await devicesCollection.updateOne({_id:new ObjectId(deviceId)}, {$set: {iat: newIat, exp: newExp}});

    }
}