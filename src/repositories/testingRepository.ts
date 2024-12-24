import {db} from "../db/db";
import {blogsCollection, postsCollection} from "../db/mongoDb";

export const testingRepository = {
    async deleteAllBlogs(){
        return await blogsCollection.deleteMany({}), postsCollection.deleteMany({})
    }
}