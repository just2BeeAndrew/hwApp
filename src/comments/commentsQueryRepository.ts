import {commentsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {CommentOutputType, CommentDBType} from "../types/db.types";


const commentsMapper = (comment: WithId<CommentDBType>): CommentOutputType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
    }
}


export const commentsQueryRepository = {
    async getCommentBy_Id(_id: string) {
        const comment = await commentsCollection.findOne({_id: new ObjectId(_id)});
        if (!comment) return null;
        return commentsMapper(comment);
    }
}