import {db} from "../db/db";
import {BlogType} from "../types/db.types";
import {blogsCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";


export const blogsRepository = {
    async getAllBlogs(){
        return await blogsCollection.find().toArray()
    },

    async createBlog(body:BlogType):Promise<ObjectId> {
        const blog: BlogType = {
            id: Math.random().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const res = await blogsCollection.insertOne(blog)
        return  res.insertedId
    },

    async getBlogById(id:string){
        return await blogsCollection.findOne({id});
    },

    async getBlogBy_Id(_id:ObjectId){
        return await blogsCollection.findOne({_id});
    },

    async updateBlog(id:string,body:BlogType):Promise<boolean> {
        const res = await blogsCollection.updateOne(
            {id},
            {$set:{ name:body.name,
                    description:body.description,
                    websiteUrl:body.websiteUrl,}}
        )
        return res.matchedCount === 1
    },

    async deleteBlog(id:string):Promise<boolean> {
        const blog = await this.getBlogById(id)
        if (blog){
            const res = await blogsCollection.deleteOne({_id: blog._id});
            if(res.deletedCount > 0) return true;
        }
        return false
    }
}
