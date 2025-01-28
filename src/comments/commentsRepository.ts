import {CommentInputType, CommentDBType} from "../types/db.types";
import {commentsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";

export const commentsRepository = {
    async getCommentBy_Id(_id: string) {
        const object_Id = new ObjectId(_id);
        const comment = await commentsCollection.findOne(object_Id);
        if (!comment) {
            return null;
        }
        return comment;
    },

    async createComment(createData: CommentInputType) {

    },

    async updateComment(_id: string, commentInput: CommentInputType) {
        const object_Id = new ObjectId(_id);
        const res = await commentsCollection.updateOne(
            {_id: object_Id},
            {
                $set: {
                    content: commentInput.content,
                }
            }
        )
        return res.matchedCount === 1
    },
}