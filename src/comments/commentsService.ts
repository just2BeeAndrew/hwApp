import {ResultStatus} from "../result/resultCode";
import {Result} from "../result/result.type";
import {CommentatorInfoType, CommentDBType, CommentInputType, UserDBType} from "../types/db.types";
import {commentsRepository} from "./commentsRepository";
import {blogsQueryRepository} from "../blogs/blogsQueryRepository";
import {postsRepository} from "../posts/postsRepository";
import {usersRepository} from "../users/usersRepository";
import {WithId} from "mongodb";

export const commentsService = {
    async createComment( postId:string, createData: string, userId:string ) {
       const userInfo: WithId<UserDBType> | null = await usersRepository.getUserBy_Id(userId);
       if (!userInfo) return {
           status: ResultStatus.NotFound,
           data: null,
           errorMessage: "User not found",
           extensions: [{field: 'User', message: 'Not Found'}],
       };

       const newComment:CommentDBType = {
           postId: postId,
           content: createData,
           commentatorInfo: {
               userId: userInfo._id.toString(),
               userLogin: userInfo.login,
           },
           createdAt: new Date().toISOString(),
       }
       const res = await commentsRepository.createComment(newComment);
       return {
           status: ResultStatus.Success,
           data: res,
           extensions: [],
       };
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