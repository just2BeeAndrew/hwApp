import {db} from "../db/db";
import {BlogType} from "../types/db.types";
import {blogsCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";


export const blogsRepository = {
    async getAllBlogs(){
        return await blogsCollection.find().toArray()
        //return db.blogs
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

    async getBlogById(_id:ObjectId){
        return await blogsCollection.findOne({_id});
    },

    async updateBlog(id:string,body:BlogType) {
        const blog = db.blogs.find(blog => blog.id == id);
        if (blog){
            blog.name = body.name;
            blog.description = body.description;
            blog.websiteUrl = body.websiteUrl;
            return blog;
        }
        return false;
    },

    async deleteBlog(id:string){
        for (let i = 0; i < db.blogs.length; i++){
            if (db.blogs[i].id === id){
                db.blogs.splice(i, 1);
                return true;
            }
        }
        return false

    }
}
