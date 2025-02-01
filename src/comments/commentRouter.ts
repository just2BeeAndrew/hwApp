import {Request, Response, Router} from 'express';
import {commentContentValidator} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {CommentInputType} from "../types/db.types";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {commentsService} from "./commentsService";
import {Result} from "../result/result.type";
import {ResultStatus} from "../result/resultCode";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/requests";
import {commentsQueryRepository} from "./commentsQueryRepository";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";

export const commentRouter = Router();

export const commentController = {
    async updateComment(req: RequestWithParamsAndBody<{ commentId: string }, CommentInputType>, res: Response) {
        const {commentId} = req.params;
        const {content} = req.body;
        const userId = req.user!.id as string;
        const updatedComment = await commentsService.updateComment(commentId, content, userId);
        if (updatedComment.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(updatedComment.status))
                .send(updatedComment.extensions);
        }

        res.sendStatus(HttpStatuses.NOCONTENT)
    },

    async deleteComment(req: RequestWithParams<{ commentId: string }>, res: Response) {
        const {commentId} = req.params;
        const userId = req.user!.id as string;
        const deleteComment = await commentsService.deleteComment(commentId, userId)

    },

    async getCommentById(req: Request, res: Response) {
        const {commentId} = req.params;
        const comment = await commentsQueryRepository.getCommentBy_Id(commentId);
        res.status(HttpStatuses.SUCCESS).json(comment);
    }

}

commentRouter.put('/:commentId',
    accessTokenMiddleware,
    commentContentValidator,
    errorsResultMiddleware,
    commentController.updateComment)
commentRouter.delete('/:commentId',
    accessTokenMiddleware,
    errorsResultMiddleware,
    commentController.deleteComment)
commentRouter.get('/:id', commentController.getCommentById)