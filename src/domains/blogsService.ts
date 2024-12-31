import {blogsRepository} from "../repositories/blogsRepository";
import {postsService} from "../domains/postsService";
import {BlogInputType, BlogDbType, BlogOutputType} from "../types/db.types";
import {ObjectId} from "mongodb";
import {SortType} from "../helpers/paginationValues";

export const blogsService = {
    async getAllBlogs(
        sortData:SortType
    ) {
        const blogs = await blogsRepository.getAllBlogs(sortData)
        const blogsCount = await blogsRepository.getBlogsCount(sortData.searchNameTerm)
        return {
            pagesCount: Math.ceil(blogsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize:sortData.pageSize,
            totalCount: blogsCount,
            items: blogs,
        }
    },

    async createBlog(createData: BlogInputType): Promise<ObjectId> {
        const blog: BlogOutputType = {
            id: Math.random().toString(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: true
        }
        const createdBlog = await blogsRepository.createBlog(blog)
        return createdBlog
    },



    async getBlogById(id: string) {
        return await blogsRepository.getBlogById(id);

    },

    async getBlogBy_Id(_id: ObjectId) {
        return await blogsRepository.getBlogBy_Id(_id);

    },

    async updateBlog(id: string, updateBlogInput: BlogInputType): Promise<boolean> {

    },

    async deleteBlog(id: string) {

    },

}