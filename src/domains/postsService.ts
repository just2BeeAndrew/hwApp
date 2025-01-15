import {BlogPostInputType, PostDBType, PostInputType} from "../types/db.types";
import {ObjectId} from "mongodb";
import {blogsCollection} from "../db/mongoDb";
import {postsRepository} from "../repositories/postsRepository";
import {SortType} from "../helpers/paginationValues";
import {blogsRepository} from "../repositories/blogsRepository";
import {blogsQueryRepository} from "../repositories/blogsQueryRepository";


export const postsService = {
    async createPost(createData: PostInputType) {
        const blogsIndex = await blogsQueryRepository.getBlogBy_Id(createData.blogId);
        if (!blogsIndex) return null

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

    async updatePost(id:string, updateData: PostInputType) {
        const blogsIndex = await blogsQueryRepository.getBlogBy_Id(updateData.blogId);
        if (!blogsIndex) throw new Error("blog index not found");

        const updatedPost = await postsRepository.updatePost(id, updateData, blogsIndex);
        return updatedPost
    },

    async deletePost(id: string): Promise<boolean> {
        const deletedPost = await postsRepository.deletePost(id);
        return deletedPost
    }
}