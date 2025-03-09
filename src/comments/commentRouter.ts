import {Request, Response, Router} from 'express';
import {commentContentValidator} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {commentsService} from "./commentsService";
import {ResultStatus} from "../result/resultCode";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";
import {RequestWithParams} from "../types/requests";
import {commentsQueryRepository} from "./commentsQueryRepository";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";

export const commentRouter = Router();

class CommentRouter {
    async updateComment(req: Request, res: Response) {
        const {commentId} = req.params;
        const {content} = req.body;
        const userId = req.user!.id as string;
        console.log(userId);
        const updatedComment = await commentsService.updateComment(commentId, content, userId);
        if (updatedComment.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(updatedComment.status))
                .send(updatedComment.extensions);
            return;
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async deleteComment(req: Request, res: Response) {
        const {commentId} = req.params;
        const userId = req.user!.id as string;
        console.log(userId);
        const deleteComment = await commentsService.deleteComment(commentId, userId)
        if (deleteComment.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(deleteComment.status))
                .send(deleteComment.extensions);
            return;
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async getCommentById(req: RequestWithParams<{ commentId:string }>, res: Response) {
        const {commentId} = req.params;
        const comment = await commentsQueryRepository.getCommentBy_Id(commentId);
        if(!comment) {
            res.sendStatus(HttpStatuses.NOT_FOUND)
            return
        }
        res.status(HttpStatuses.SUCCESS).json(comment);
    }
}

export const commentController = new CommentRouter();

commentRouter.put('/:commentId',
    commentContentValidator,
    accessTokenMiddleware,
    errorsResultMiddleware,
    commentController.updateComment)
commentRouter.delete('/:commentId',
    accessTokenMiddleware,
    errorsResultMiddleware,
    commentController.deleteComment)
commentRouter.get('/:commentId', commentController.getCommentById)