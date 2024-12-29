import {blogRepository} from "../repositories/blogRepository";
import {postsRepository} from "../repositories/postsRepository";
import {BlogInputType, BlogDbType} from "../types/db.types";
import {ObjectId} from "mongodb";


export const blogService = {
    async getAllBlogs(
        searchNameTerm: string | null,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        pageNumber: number,
        pageSize: number
    ){
        const blogs = await blogRepository.getAllBlogs(
            searchNameTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        )
        const blogsCount = await blogRepository.getBlogsCount(searchNameTerm)
        return {
            pagesCount: Math.ceil(blogsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: blogsCount,
            items: blogs,
        }
    },

    async createBlog(createData: BlogInputType): Promise<ObjectId> {
        const blog:BlogDbType = {
            id: Math.random().toString(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdBlog = await blogRepository.createBlog(blog)
        return createdBlog
    },

    async getPostsByBlogId(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        blogId: string
    ) {
        const posts = await postsRepository.getPostsByBlogId(blogId)
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: postsCount,
            items: posts,
        }

    },

    async getBlogById(id: string) {
        return await blogRepository.getBlogById(id);

    },

    async getBlogBy_Id(_id: ObjectId) {
        return await blogRepository.getBlogBy_Id(_id);

    },

    async updateBlog(id: string, updateBlogInput: BlogInputType): Promise<boolean> {

    },

    async deleteBlog(id: string) {

    }
}