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

    async findStatus(userId: string, commentId: string, status: string) {
        return await LikesModel.findOne({userid: userId, commentId: commentId, status: status}).exec();

    }

    async createStatus(newStatus: LikesDBType) {
        await LikesModel.create(newStatus)
    }

    async updateStatus(statusId: ObjectId, status: LikeStatus) {
        const statusInstance = await LikesModel.findOne({_id: statusId})
        if (!statusInstance) {
            return false;
        }
        statusInstance.status = status
        await statusInstance.save()
        return true
    }

    async statusCount(commentId: string, status: LikeStatus) {
        return await LikesModel.countDocuments({commentId: commentId, status: status})
    }

    async updateStatusCounter(commentId: string, count: number) {
        await CommentsModel.findOneAndUpdate({commentId: commentId}, {likesCount: count})
    }


}