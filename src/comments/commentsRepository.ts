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

    async findStatus(userId: string, commentId: string, status: string): Promise<boolean> {
        await LikesModel.findOne({userid: userId, commentId: commentId, status: status}).exec();
        if (!status) {
            return false
        }
        return true
    }

    async createLike(newStatus: LikesDBType) {
        await LikesModel.create(newStatus)
    }

    async updateLikesCount(commentId: string,likeStatus: LikeStatus) {
        const commentInstance = await CommentsModel.findOne({_id: new ObjectId(commentId)})
        if (!commentInstance) {return false}

        commentInstance.likesInfo.likesCount +=1
        commentInstance.likesInfo.myStatus = likeStatus
        await commentInstance.save()
        return true
    }

    async deleteLike(_id: string) {

    }
}