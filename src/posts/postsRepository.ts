import {
    PostInputType,
    PostDBType,
    BlogOutputType,
    LikeStatus,
    PostsLikesDBType,
    LikesDetailsType
} from "../types/db.types";
import {PostsModel, ReactionForPostsModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {


    async getPostBy_Id(_id: string) {
        const post = await PostsModel.findOne({_id: new ObjectId(_id)});
        if (!post) {
            return null
        }
        return post;
    }

    async createPost(createdPost: PostDBType): Promise<ObjectId> {
        const res = await PostsModel.create(createdPost);
        return res._id;
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

    async findReaction(userId: string, postid: string) {
        return await ReactionForPostsModel.findOne({userId: userId, postid: postid});
    }

    async createReaction(newReaction: PostsLikesDBType) {
        const savedReaction = new ReactionForPostsModel({
            userId: newReaction.userId,
            login: newReaction.login,
            postId: newReaction.postId,
            status: newReaction.status,
            addedAt: newReaction.addedAt
        })
        const result = await savedReaction.save();
        return result.toObject({versionKey: false});
    }

    async updateReaction(reactionId: ObjectId, reaction: LikeStatus) {
        const result = await ReactionForPostsModel.findByIdAndUpdate(reactionId, {reaction}, {new: true});
        return !!result;
    }

    async updateReactionCounter(postId: string, likesCount: number, dislikesCount: number) {
        await PostsModel.findOneAndUpdate({_id: postId},
            {'extendedLikesInfo.likesCount': likesCount, 'extendedLikesInfo.dislikesCount': dislikesCount})
    }

    async getNewestLikesByPostId(postId: string) {
        const likes = await ReactionForPostsModel
            .find({postId: postId, status: LikeStatus.Like})
            .sort({addedAt: -1})
            .limit(3)
            .exec();
        return likes.map(like => {
            return new LikesDetailsType(
                like.addedAt,
                like.userId,
                like.login
            );
        });
    }

}