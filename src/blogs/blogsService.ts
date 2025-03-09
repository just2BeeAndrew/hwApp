import {blogsRepository} from "./blogsRepository";
import {BlogInputType, BlogDBType} from "../types/db.types";


class BlogsService {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const blog = new BlogDBType(
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false
        )
        return await blogsRepository.createBlog(blog)
    }

    async updateBlog(id: string, updateBlogInput: BlogInputType): Promise<boolean> {
        return await blogsRepository.updateBlog(id, updateBlogInput)
    }

    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id);
    }
}

export const blogsService = new BlogsService();