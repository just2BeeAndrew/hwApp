import {BlogInputType, BlogDbType, BlogOutputType} from "../types/db.types";
import {blogsCollection, postsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";



export const blogsRepository = {
    async createBlog(createdBlog: BlogDbType): Promise<ObjectId> {
        const res = await blogsCollection.insertOne(createdBlog)
        return res.insertedId
    },

    async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
        const res = await blogsCollection.updateOne(
            {id},
            {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                }
            }
        )
        return res.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const blog = await blogsCollection.findOne({id});
        if (blog) {
            const res = await blogsCollection.deleteOne({_id: blog._id});
            if (res.deletedCount > 0) return true;
        }
        return false
    }
}
