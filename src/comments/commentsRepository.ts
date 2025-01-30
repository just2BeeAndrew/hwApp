import {CommentInputType, CommentDBType} from "../types/db.types";
import {commentsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";

export const commentsRepository = {
    async getCommentBy_Id(_id: string) {
        const comment = await commentsCollection.findOne({_id:new ObjectId(_id)});
        if (!comment) {
            return null;
        }
        return comment;
    },

    async createComment(newComment: CommentDBType ):Promise<string> {
        const res = await commentsCollection.insertOne(newComment);
        return res.insertedId.toString();
    },

    async updateComment(_id: string, commentInput: CommentInputType) {
        const res = await commentsCollection.updateOne(
            {_id: new ObjectId(_id)},
            {
                $set: {
                    content: commentInput.content,
                }
            }
        )
        return res.matchedCount === 1
    },
}