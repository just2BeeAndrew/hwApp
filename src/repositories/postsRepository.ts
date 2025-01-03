import {db} from "../db/db";
import {PostInputType, PostDBType, PostOutputType, BlogDbType, BlogInputType, BlogOutputType} from "../types/db.types";
import {blogsCollection, postsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {SortType} from "../helpers/paginationValues";
import {blogsRepository} from "./blogsRepository";

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

export const postsRepository = {
    async getAllPosts(sortData: SortType) {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData;
        const posts = await postsCollection
            .find()
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
        return posts.map(postMapper)
    },

    getPostsCount(blogId: string): Promise<number> {
        const filter: any = {}
        if (blogId) {
            filter.blogId = blogId;
        }
        return postsCollection.countDocuments(filter)
    },

    getAllPostsCount(): Promise<number> {
        return postsCollection.countDocuments({})
    },



    async createPost(createdPost: PostDBType): Promise<ObjectId> {
        const res = await postsCollection.insertOne(createdPost);
        return res.insertedId
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
        return posts.map(postMapper)
    },


    async updatePost(id: string, body: PostInputType, blogsIndex: BlogOutputType): Promise<boolean> {
        const res = await postsCollection.updateOne(
            {id},
            {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                    blogName: blogsIndex.name,
                }
            }
        )
        return res.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const post = await postsCollection.findOne({id});
        if (post) {
            const res = await postsCollection.deleteOne({_id: post._id});
            if (res.deletedCount > 0) return true;
        }
        return false
    }
}