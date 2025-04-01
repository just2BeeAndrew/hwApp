import {CommentDBType, LikesDBType, LikeStatus} from "../types/db.types";
import {CommentsModel, LikesModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async getCommentBy_Id(_id: string) {
        const comment = await CommentsModel.findOne({_id: new ObjectId(_id)});
        if (!comment) {
            return null;
        }
        return comment;
    }

    async createComment(newComment: CommentDBType): Promise<string> {
        const res = await CommentsModel.create(newComment);
        return res._id.toString();
    }

    async updateComment(_id: string, content: string) {
        const comment = await this.getCommentBy_Id(_id)
        if (!comment) {
            return false;
        }
        comment.content = content;
        await comment.save()

        return true
    }

    async deleteComment(_id: string) {
        const isDeleted = await CommentsModel.deleteOne({_id: new ObjectId(_id)});
        return isDeleted.deletedCount === 1;
    }

    async findStatus(userId: string, commentId: string) {
        return await LikesModel.findOne({userId: userId, commentId: commentId}).exec();
    }

    async createStatus(newStatus: LikesDBType) {
        const savedStatus = new LikesModel({
            userId: newStatus.userId,
            commentId: newStatus.commentId,
            status: newStatus.status,
        })
        const result = await savedStatus.save()
        return result.toObject({versionKey: false})
    }

    async updateStatus(statusId: ObjectId, status: LikeStatus) {
        const result = await LikesModel.findByIdAndUpdate(statusId, {status}, {new: true});
        return !!result;
    }

    async updateStatusCounter(commentId: string, likesCount: number, dislikesCount: number) {
        console.log(`comments=${commentId}likes=${likesCount}dislikes=${dislikesCount}`);
        await CommentsModel.findOneAndUpdate({_id: commentId},
            {'likesInfo.likesCount': likesCount, 'likesInfo.dislikesCount': dislikesCount})
    }


}