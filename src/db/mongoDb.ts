import {MongoClient, Collection} from "mongodb";
import mongoose, {connection, Schema} from "mongoose";
import {
    BlogDBType,
    CommentDBType,
    PostDBType,
    UserDBType,
    BlackListRefreshTokensType,
    DevicesDBType, DeviceRateDBType, ConfirmationType, accountDataType
} from "../types/db.types";
import {SETTINGS} from "../settings";
import * as dotenv from "dotenv";
dotenv.config();

// export let blogsCollection: Collection<BlogDBType>
// export let commentsCollection: Collection<CommentDBType>
// export let postsCollection: Collection<PostDBType>
// export let usersCollection: Collection<UserDBType>
// export let tokensCollection: Collection<BlackListRefreshTokensType>
// export let devicesCollection: Collection<DevicesDBType>
// export let devicesRateCollection: Collection<DeviceRateDBType>

const UserSchema = new mongoose.Schema({
    accountData: accountDataType,
    emailConfirmation: ConfirmationType
})

export const UserModel = mongoose.model(SETTINGS.PATH.USERS, UserSchema)

const DeviceRate = new mongoose.Schema({
    IP: String,
    URL: String,
    date: Date
})

export const DeviceReteModel = mongoose.model(SETTINGS.PATH.DEVICES, DeviceRate)

export async function runDb(url: string):Promise<boolean>{
    //let client = new MongoClient(url)
    //let db = client.db(SETTINGS.DB_NAME)

    //blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS)
    //postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS)
    //commentsCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS)
    //usersCollection = db.collection<UserDBType>(SETTINGS.PATH.USERS)
    //tokensCollection = db.collection<BlackListRefreshTokensType>(SETTINGS.PATH.BLACKLIST)
    //devicesCollection = db.collection<DevicesDBType>(SETTINGS.PATH.SECURITY_DEVICES)
    //devicesRateCollection = db.collection<DeviceRateDBType>(SETTINGS.PATH.DEVICES)

    try {
        //await client.connect();
        await mongoose.connect(url + "/" + SETTINGS.DB_NAME)
        //await db.command({ ping: 1 });
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Не встал =(')
        }
        await DeviceReteModel.createIndexes(
            { date: 1 },
            {
                expireAfterSeconds: 10,
                name: "ttl_requests_index"
            }
        );
        console.log('У нас 10 секунд...ДвИиигаем!!! -До чего? -До полного п*****а, сынуля, до пОООлного п****а!!! © Баба Зина ')
        console.log('Не упал @_@')
        return true
    } catch (error) {
        console.log(error);
        console.log("Упал *0*")
        //await client.close();
        await mongoose.disconnect();
        return false;
    }
}






