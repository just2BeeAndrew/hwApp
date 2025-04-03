import {BlogInputType, BlogDBType} from "../types/db.types";
import {BlogsModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {
    async createBlog(createdBlog: BlogDBType): Promise<string> {
        const res = await BlogsModel.create(createdBlog)
        return res._id.toString()
    }

    async updateBlog(id: string, body: BlogInputType): Promise<boolean> {
        const object_Id = new ObjectId(id)
        const res = await BlogsModel.updateOne(
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
    }

    async deleteBlog(id: string): Promise<boolean> {
        const blog = await BlogsModel.findOne({_id: new ObjectId(id)});
        if (blog) {
            const res = await BlogsModel.deleteOne({_id: blog._id});
            if (res.deletedCount > 0) return true;
        }
        return false
    }
}