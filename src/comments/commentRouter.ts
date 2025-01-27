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

export const commentRouter = Router();

export const commentController = {
    async updateComment(req: Request<{commentId: string}, {}, CommentInputType>, res: Response) {
        const updatedComment = await commentsService.updateComment(req.params.commentId, req.body);
        if (updatedComment.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(updatedComment.status))
                .send(updatedComment.extensions);
        }

        res.sendStatus(HttpStatuses.NOCONTENT)
    },

    async deleteComment(req: Request, res: Response) {

    },

    async getCommentById(req: Request, res: Response) {

    }

}

commentRouter.put('/:commentId',
    commentContentValidator,
    authorizationMiddleware,
    errorsResultMiddleware,
    commentController.updateComment)
commentRouter.delete('/:commentId', commentController.deleteComment)
commentRouter.get('/:id', commentController.getCommentById)