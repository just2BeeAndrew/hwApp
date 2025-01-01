import {PostDBType, PostInputType} from "../types/db.types";
import {ObjectId} from "mongodb";
import {blogsCollection} from "../db/mongoDb";
import {postsRepository} from "../repositories/postsRepository";
import {SortType} from "../helpers/paginationValues";
import {blogsRepository} from "../repositories/blogsRepository";


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

    async getPostsByBlogId(blogId: string, sortData:SortType) {
        const posts = await postsRepository.getPostsByBlogId(blogId, sortData)
        const postsCount = await postsRepository.getPostsCount(blogId)
        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize:sortData.pageSize,
            totalCount: postsCount,
            items: posts,
        }
    },

    async createPostByBlogId(blogId: string,createData: PostInputType ): Promise<ObjectId> {
        const blogsIndex = await blogsRepository.getBlogById(blogId);
        if (!blogsIndex) throw new Error("blog index not found");

        const post: PostDBType = {
            id: Math.random().toString(),
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: blogId,
            blogName: blogsIndex.name,
            createdAt: new Date().toISOString()
        }
        const createdPost = await postsRepository.createPost(post);
        return createdPost

    }
}