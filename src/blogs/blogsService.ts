import {BlogsRepository} from "./blogsRepository";
import {BlogInputType, BlogDBType} from "../types/db.types";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository) {
    }
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const blog = new BlogDBType(
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false
        )
        return await this.blogsRepository.createBlog(blog)
    }

    async updateBlog(id: string, updateBlogInput: BlogInputType): Promise<boolean> {
        return await this.blogsRepository.updateBlog(id, updateBlogInput)
    }

    async deleteBlog(id: string) {
        return await this.blogsRepository.deleteBlog(id);
    }
}
