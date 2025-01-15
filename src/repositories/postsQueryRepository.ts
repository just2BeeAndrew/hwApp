import {SortType} from "../helpers/paginationValues";
import {postsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {PostDBType, PostOutputType} from "../types/db.types";
import {blogsQueryRepository} from "./blogsQueryRepository";

const postMapper = (post: WithId<PostDBType>): PostOutputType => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}

export const postsQueryRepository = {
    async getAllPosts(sortData: SortType) {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData;
        const posts = await postsCollection
            .find()
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const postsCount = await this.getPostsCount() //await postsCollection.countDocuments({})
        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: postsCount,
            items: posts.map(postMapper),
        }

    },

    getPostsCount(blogId?: string): Promise<number> {
        const filter: any = {}
        if (blogId) {
            filter.blogId = blogId;
        }
        return postsCollection.countDocuments(filter)
    },

    async getPostById(id: string) {
        const posts = await postsCollection.findOne({id:id});
        if (!posts) {
            return null
        }
        return postMapper(posts);
    },

    async getPostBy_Id(_id: ObjectId) {
        const posts = await postsCollection.findOne({_id});
        if (!posts) {
            return null
        }
        return postMapper(posts);
    },

    async getPostsByBlogId(blogId: string, sortData: SortType) {
        const blogsIndex = await blogsQueryRepository.getBlogBy_Id(blogId);
        if (!blogsIndex) return null

        const {sortBy, sortDirection, pageSize, pageNumber} = sortData;
        const filteredPosts: any = {}
        if (!blogId) {
            return null
        }
        filteredPosts.blogId = blogId;

        const posts = await postsCollection
            .find(filteredPosts)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        const postsCount = await this.getPostsCount(blogId) //await postsCollection.countDocuments(filteredPosts)
        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: postsCount,
            items: posts.map(postMapper),
        }
    },

}