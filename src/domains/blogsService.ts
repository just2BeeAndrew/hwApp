import {blogRepository} from "../repositories/blogRepository";
import {BlogInputType, BlogDbType} from "../types/db.types";


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
    }
}