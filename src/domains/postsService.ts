import {PostDBType, PostInputType} from "../types/db.types";
import {ObjectId} from "mongodb";
import {blogsCollection} from "../db/mongoDb";
import {postsRepository} from "../repositories/postsRepository";


export const postsService = {
    async createPost(createData: PostInputType): Promise<ObjectId> {
        const blogsIndex = await blogsCollection.findOne({id: createData.blogId});
        if (!blogsIndex) throw new Error("blog index not found");

        const post: PostDBType = {
            id: Math.random().toString(),
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName: blogsIndex.name,
            createdAt: new Date().toISOString()
        }
        const createdPost = await postsRepository.createPost(post);
        return createdPost
    },

    async getPostsByBlogId() {}
}