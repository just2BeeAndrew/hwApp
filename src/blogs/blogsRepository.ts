import {BlogInputType, BlogDBType} from "../types/db.types";
import {blogsCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";

export const blogsRepository = {
    async createBlog(createdBlog: BlogDBType): Promise<string> {
        const res = await blogsCollection.insertOne(createdBlog)
        return res.insertedId.toString()
    },

    async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
        const object_Id = new ObjectId(id)
        const res = await blogsCollection.updateOne(
            {_id:object_Id},
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
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)});
        if (blog) {
            const res = await blogsCollection.deleteOne({_id: blog._id});
            if (res.deletedCount > 0) return true;
        }
        return false
    }
}
