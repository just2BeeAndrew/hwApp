import {devicesCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";

export const securityDevicesQueryRepository = {
    async getAllDevicesSessions(id: string) {
        const devices = await devicesCollection.find({_id: new ObjectId(id)});
        return devices;

    }
}