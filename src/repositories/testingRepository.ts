import {db} from "../db/db";
import {blogsCollection, postsCollection} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll(){
        return await blogsCollection.deleteMany({}), postsCollection.deleteMany({})
    }
}