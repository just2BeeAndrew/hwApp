import {blogsRepository} from "./blogsRepository";
import {BlogInputType, BlogOutputType,BlogDBType} from "../types/db.types";
import {ObjectId} from "mongodb";

export const blogsService = {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const blog: BlogDBType = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
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