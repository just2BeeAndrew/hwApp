import {MongoClient, Collection} from "mongodb";
import {BlogType, PostType} from "../types/db.types";
import {SETTINGS} from "../settings";
import * as dotenv from "dotenv";

dotenv.config();

export let blogsCollection: Collection<BlogType>
export let postsCollection: Collection<PostType>

export async function runDb(url: string): Promise<boolean> {
    const client = new MongoClient(SETTINGS.MONGO_URL)
    const db = client.db(SETTINGS.DB_NAME)

    blogsCollection = db.collection<BlogType>(SETTINGS.PATH.BLOGS)
    postsCollection = db.collection(SETTINGS.PATH.POSTS)

    try {
        await client.connect();
        await db.command({ping: 1})
        console.log('OK')
        return true
    } catch (error) {
        console.log(error)
        await client.close();
        return false;
    }
}






