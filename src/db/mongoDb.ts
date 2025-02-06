import {MongoClient,Db, Collection} from "mongodb";
import {BlogDBType, CommentDBType, PostDBType, UserAccountDBType, UserDBType} from "../types/db.types";
import {SETTINGS} from "../settings";
import * as dotenv from "dotenv";
dotenv.config();

export let blogsCollection: Collection<BlogDBType>
export let commentsCollection: Collection<CommentDBType>
export let postsCollection: Collection<PostDBType>
export let usersCollection: Collection<UserAccountDBType>

export async function runDb(url: string):Promise<boolean>{
    let client = new MongoClient(url)
    let db = client.db(SETTINGS.DB_NAME)

    blogsCollection = db.collection<BlogDBType>(SETTINGS.PATH.BLOGS)
    postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS)
    commentsCollection = db.collection<CommentDBType>(SETTINGS.PATH.COMMENTS)
    usersCollection = db.collection<UserAccountDBType>(SETTINGS.PATH.USERS)

    try {
        await client.connect();
        await db.command({ ping: 1 });
        console.log('Не упал @_@')
        return true
    } catch (error) {
        console.log(error);
        console.log("Упал *0*")
        await client.close();
        return false;
    }
}






