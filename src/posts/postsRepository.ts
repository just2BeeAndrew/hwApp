import {PostInputType, PostDBType,   BlogOutputType} from "../types/db.types";
import {PostsModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {


    async getPostBy_Id(_id: string) {
        const post = await PostsModel.findOne({_id:new ObjectId(_id)});
        if (!post) {
            return null
        }
        return post;
    }

    async createPost(createdPost: PostDBType): Promise<ObjectId> {
        const res = await PostsModel.create(createdPost);
        return res._id
    }

    async updatePost(id: string, body: PostInputType, blogsIndex: BlogOutputType): Promise<boolean> {
        const res = await PostsModel.updateOne(
            {_id: new ObjectId(id)},
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
    }

    async deletePost(id: string): Promise<boolean> {
        const post = await PostsModel.findOne({_id: new ObjectId(id)});
        if (post) {
            const res = await PostsModel.deleteOne({_id: post._id});
            if (res.deletedCount > 0) return true;
        }
        return false
    }
}

export const postsRepository = new PostsRepository();