import {ResultStatus} from "../result/resultCode";
import {Result} from "../result/result.type";
import {CommentatorInfoType, CommentDBType, CommentInputType} from "../types/db.types";
import {commentsRepository} from "./commentsRepository";
import {blogsQueryRepository} from "../blogs/blogsQueryRepository";
import {postsRepository} from "../posts/postsRepository";
import {usersRepository} from "../users/usersRepository";

export const commentsService = {
    async createComment( postId:string, createData: string, userId:string ) {
       //const userInfo = await usersRepository.getUserBy_Id();

       // const commentatorInfo: CommentatorInfoType = {
       //     userId: postInfo.
       // }
    },

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