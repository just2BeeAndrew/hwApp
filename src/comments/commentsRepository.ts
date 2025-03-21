import {CommentDBType} from "../types/db.types";
import {commentsCollection, CommentsModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class CommentsRepository {
    async getCommentBy_Id(_id: string) {
        const comment = await commentsCollection.findOne({_id:new ObjectId(_id)});
        if (!comment) {
            return null;
        }
        return comment;
    }

    async createComment(newComment: CommentDBType ):Promise<string> {
        const res = await CommentsModel.create(newComment);
        return res._id.toString();
    }

    async updateComment(_id: string, commentInput: string) {
        const res = await commentsCollection.updateOne(
            {_id: new ObjectId(_id)},
            {
                $set: {
                    content: commentInput,
                }
            }
        )
        return res.matchedCount === 1
    }

    async deleteComment(_id: string) {
        const isDeleted = await commentsCollection.deleteOne({_id: new ObjectId(_id)});
        return isDeleted.deletedCount === 1;
    }
}