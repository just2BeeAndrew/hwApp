import {MongoClient,Db, Collection} from "mongodb";
import {BlogDBType, PostDBType, UserDBType} from "../types/db.types";
import {SETTINGS} from "../settings";
import * as dotenv from "dotenv";
dotenv.config();

export let blogsCollection: Collection<BlogDBType>
export let postsCollection: Collection<PostDBType>
export let usersCollection: Collection<UserDBType>

export async function runDb(url: string):Promise<boolean>{
    let client = new MongoClient(url)
    let db = client.db(SETTINGS.DB_NAME)

    blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS)
    postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS)

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('OK')
        return true
    } catch (error) {
        console.log(error);
        console.log("сервер не встал")
        await client.close();
        return false;
    }
}






