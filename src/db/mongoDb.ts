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

export let blogsCollection: Collection<BlogDBType>
export let commentsCollection: Collection<CommentDBType>
export let postsCollection: Collection<PostDBType>

export let tokensCollection: Collection<BlackListRefreshTokensType>
export let devicesCollection: Collection<DevicesDBType>


const UserSchema = new mongoose.Schema<UserDBType>({
    accountData: {type: accountDataType, required: true},
    emailConfirmation: {type: ConfirmationType, required: true},
})

export const UserModel = mongoose.model(SETTINGS.PATH.USERS, UserSchema)

const DeviceRate = new mongoose.Schema({
    IP: {type: String, required: true},
    URL: {type: String, required: true},
    date: {type:Date, required: true},
})

const DeviceRateSchema = new mongoose.Schema({
    IP: String,
    URL: String,
    date: {
        type: Date,
        expires: 10,
        default: Date.now
    }
})

export const DeviceRateModel = mongoose.model(SETTINGS.PATH.DEVICES, DeviceRateSchema);

export async function runDb(url: string): Promise<boolean> {
    let client = new MongoClient(url)//удалить при полном переводе на mongoose
    let db = client.db(SETTINGS.DB_NAME)//удалить при полном переводе на mongoose

    blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS)
    postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS)
    commentsCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS)

    tokensCollection = db.collection<BlackListRefreshTokensType>(SETTINGS.PATH.BLACKLIST)
    devicesCollection = db.collection<DevicesDBType>(SETTINGS.PATH.SECURITY_DEVICES)


    try {
        await client.connect();//удалить при полном переводе на mongoose
        await mongoose.connect(url + "/" + SETTINGS.DB_NAME)
        //await db.command({ ping: 1 });
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Не встал =(')
        }

        console.log('У нас 10 секунд...ДвИиигаем!!! -До чего? -До полного п*****а, сынуля, до пОООлного п****а!!! © Баба Зина ')
        console.log('Не упал @_@')
        return true
    } catch (error) {
        console.log(error);
        console.log("Упал *0*")
        await client.close();//удалить при полном переводе на mongoose
        await mongoose.disconnect();
        return false;
    }
}






