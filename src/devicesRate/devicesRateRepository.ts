import {devicesRateCollection} from "../db/mongoDb";

export const devicesRateRepository = {
    async addRequestInfo(IP:string, URL:string, date: Date){
        await devicesRateCollection.insertOne({IP, URL, date});
        return
    },

    async requestCount(IP:string, URL:string, date:Date){
        return await devicesRateCollection.countDocuments({
            IP,
            URL,
            date :{$gte: new Date(Date.now() - 10000)},
        })
    }

}