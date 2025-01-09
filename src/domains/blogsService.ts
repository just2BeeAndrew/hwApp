import {blogsRepository} from "../repositories/blogsRepository";
import {BlogInputType, BlogOutputType} from "../types/db.types";
import {ObjectId} from "mongodb";

export const blogsService = {
    async createBlog(createData: BlogInputType): Promise<ObjectId> {
        const blog: BlogOutputType = {
            id: _id.toString(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdBlog = await blogsRepository.createBlog(blog)
        return createdBlog
    },

    async updateBlog(id: string, updateBlogInput: BlogInputType): Promise<boolean> {
        return await blogsRepository.updateBlog(id,updateBlogInput)

    },

    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id);
    },

}