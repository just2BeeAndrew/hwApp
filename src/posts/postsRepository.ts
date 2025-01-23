import {PostInputType, PostDBType,   BlogOutputType} from "../types/db.types";
import {postsCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async createPost(createdPost: PostDBType): Promise<ObjectId> {
        const res = await postsCollection.insertOne(createdPost);
        return res.insertedId
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