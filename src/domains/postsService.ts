import {BlogPostInputType, PostDBType, PostInputType} from "../types/db.types";
import {ObjectId} from "mongodb";
import {blogsCollection} from "../db/mongoDb";
import {postsRepository} from "../repositories/postsRepository";
import {SortType} from "../helpers/paginationValues";
import {blogsRepository} from "../repositories/blogsRepository";


export const postsService = {
    async getAllPosts(
        sortData: SortType
    ) {
        const posts = await postsRepository.getAllPosts(sortData)
        const postsCount = await postsRepository.getAllPostsCount()//!!!Уточнить на саппорте
        console.log(postsCount)
        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: postsCount,
            items: posts,
        }
    },

    async createPost(createData: PostInputType):Promise<ObjectId> {
        const blogsIndex = await blogsRepository.getBlogById(createData.blogId);
        console.log(blogsIndex)
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

    async getPostsByBlogId(sortData: SortType, blogId: string) {
        const posts = await postsRepository.getPostsByBlogId(blogId, sortData)
        const postsCount = await postsRepository.getPostsCount(blogId)
        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: postsCount,
            items: posts,
        }
    },

    async getPostById(id: string) {
        return await postsRepository.getPostById(id)
    },


    async getPostBy_Id(_id: ObjectId) {
        return await postsRepository.getPostBy_Id(_id);
    },

    async updatePost(id:string, updateData: PostInputType) {
        const blogsIndex = await blogsRepository.getBlogById(updateData.blogId);
        if (!blogsIndex) throw new Error("blog index not found");

        const updatedPost = await postsRepository.updatePost(id, updateData, blogsIndex);
        return updatedPost
    },

    async deletePost(id: string): Promise<boolean> {
        const deletedPost = await postsRepository.deletePost(id);
        return deletedPost
    }
}