import {DevicesDBType} from "../types/db.types";
import {devicesCollection} from "../db/mongoDb";

export const devicesRepository = {
    async addDevice(device: DevicesDBType) {
        await devicesCollection.insertOne(device);
    }
}