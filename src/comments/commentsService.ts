import {ResultStatus} from "../result/resultCode";
import {Result} from "../result/result.type";
import {CommentInputType} from "../types/db.types";
import {commentsRepository} from "./commentsRepository";

export const commentsService = {
    async updateComment (commentId: string, updateComment: CommentInputType):Promise<Result> {
        const isExists = await commentsRepository.getCommentBy_Id(commentId);
        if (!isExists) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Not Found",
                extensions: [{field: "commentId", message: "NotFound"}]
            }
        }

        const updatedComment = await  commentsRepository.updateComment(commentId, updateComment);
        return {
            status: ResultStatus.NoContent,
            data: null,
            extensions: []
        }


    },

    async deleteComment () {

    },

    async getCommentById () {

    }
}