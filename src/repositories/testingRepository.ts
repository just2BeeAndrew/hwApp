import {db} from "../db/db";

export const testingRepository = {
    async deleteAllBlogs(){
        return db.blogs.length = 0, db.posts.length = 0
    }
}