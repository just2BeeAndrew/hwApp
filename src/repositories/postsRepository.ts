import {db} from "../db/db";
import {PostType, BlogDbType} from "../types/db.types";
import {blogsCollection, postsCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";


export const postsRepository = {
    async getAllPosts() {
        return await postsCollection.find({},{projection:{_id:0}}).toArray()
    },

    async createPost(body: PostType): Promise<ObjectId> {
        const blogsIndex = await blogsCollection.findOne({id: body.blogId});
        if (!blogsIndex) throw new Error("blog index not found");

        const post: PostType = {
            id: Math.random().toString(),
            title: body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: blogsIndex.name,
            createdAt: new Date().toISOString()
        }
        const res = await postsCollection.insertOne(post);
        return res.insertedId
    },

    async getPostById(id: string) {
        return await postsCollection.findOne({id}, {projection:{_id:0}});
    },

    async getPostBy_Id(_id: ObjectId) {
        return await postsCollection.findOne({_id},{projection:{_id:0}});
    },

    async getPostsByBlogId(blogId: string) {
        return await postsCollection.findOne({blogId},{projection:{_id:0}});
    },

    async updatePost(id: string, body: PostType): Promise<boolean> {
        const blogsIndex = await blogsCollection.findOne({id: body.blogId});
        if (!blogsIndex) throw new Error("blog index not found");

        const res = await postsCollection.updateOne(
            {id},
            {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                    blogName: blogsIndex.name,
                }
            }
        )
        return res.matchedCount === 1
    },

    async deletePost(id:string):Promise<boolean> {
        const post = await postsCollection.findOne({id});
        if (post){
            const res = await postsCollection.deleteOne({_id: post._id});
            if(res.deletedCount > 0) return true;
        }
        return false
    }
}