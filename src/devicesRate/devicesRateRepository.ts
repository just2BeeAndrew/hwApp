import {devicesRateCollection} from "../db/mongoDb";

class DevicesRateRepository {
    async addRequestInfo(IP:string, URL:string, date: Date){
        await devicesRateCollection.insertOne({IP, URL, date});
        return
    }

    async requestCount(IP:string, URL:string){
        return await devicesRateCollection.countDocuments({
            IP,
            URL,
            date :{$gte: new Date(Date.now() - 10000)},
        })
    }
}

export const devicesRateRepository = new DevicesRateRepository();