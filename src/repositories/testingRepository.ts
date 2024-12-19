import {db} from "../db/db";

export const testingRepository = {
    deleteAllBlogs(){
        return db.blogs.length = 0, db.posts.length = 0
    }
}