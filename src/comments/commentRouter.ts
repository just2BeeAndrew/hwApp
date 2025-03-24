import {Router} from 'express';
import {commentContentValidator} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {CommentsController} from "./commentsController";
import {container} from "../composition-root";
import {authChecker} from "../middlewares/authChecker";

const commentsController = container.get(CommentsController);

export const commentRouter = Router();

commentRouter.put('/:commentId/like-status',
    accessTokenMiddleware,
    errorsResultMiddleware,
    commentsController.likeStatus.bind(commentsController))
commentRouter.put('/:commentId',
    commentContentValidator,
    accessTokenMiddleware,
    errorsResultMiddleware,
    commentsController.updateComment.bind(commentsController))
commentRouter.delete('/:commentId',
    accessTokenMiddleware,
    errorsResultMiddleware,
    commentsController.deleteComment.bind(commentsController),)
commentRouter.get('/:commentId',
    authChecker,
    commentsController.getCommentById.bind(commentsController));