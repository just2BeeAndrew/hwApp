import {devicesCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {DevicesDBType, DevicesOutputType} from "../types/db.types";

const deviceMapper = (device: WithId<DevicesDBType>): DevicesOutputType => {
    return {
        ip:device.ip,
        title:device.title,
        lastActiveDate:new Date(device.iat * 1000).toISOString(),
        deviceId: device._id.toString(),
    }
}

export const securityDevicesQueryRepository = {
    async getAllDevicesSessions(userId: string) {
        const devices = await devicesCollection.find({userId: userId}).toArray();
        return devices.map(deviceMapper);
    }
}