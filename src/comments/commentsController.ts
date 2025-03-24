import {Request, Response} from "express";
import {CommentsService} from "./commentsService";
import {ResultStatus} from "../result/resultCode";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/requests";
import {CommentsQueryRepository} from "./commentsQueryRepository";
import {inject, injectable} from "inversify";
import {LikeStatus} from "../types/db.types";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async likeStatus(req: RequestWithParamsAndBody<{ commentId: string }, { status: LikeStatus }>, res: Response) {
        const userId = req.user!.id as string;
        const {commentId} = req.params;
        const {status} = req.body;
        const result = await this.commentsService.likeStatus(commentId, userId, status);

    }

    async updateComment(req: Request, res: Response) {
        const {commentId} = req.params;
        const {content} = req.body;
        const userId = req.user!.id as string;
        console.log(userId);
        const updatedComment = await this.commentsService.updateComment(commentId, content, userId);
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
        const deleteComment = await this.commentsService.deleteComment(commentId, userId)
        if (deleteComment.status !== ResultStatus.NoContent) {
            res
                .status(resultCodeToHttpException(deleteComment.status))
                .send(deleteComment.extensions);
            return;
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async getCommentById(req: RequestWithParams<{ commentId: string }>, res: Response) {
        const {commentId} = req.params;
        const comment = await this.commentsQueryRepository.getCommentBy_Id(commentId);
        if (!comment) {
            res.sendStatus(HttpStatuses.NOT_FOUND)
            return
        }
        res.status(HttpStatuses.SUCCESS).json(comment);
    }
}