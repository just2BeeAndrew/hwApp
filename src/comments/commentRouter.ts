import {Request, Response, Router} from 'express';
import {commentContentValidator} from "../middlewares/expressValidationMiddleware";

export const commentRouter = Router();

export const commentController = {
    async updateComment (req: Request, res: Response) {

    },

    async deleteComment (req: Request, res: Response) {

    },

    async getCommentById (req: Request, res: Response) {

    }

}

commentRouter.put('/:commentId',commentContentValidator,commentController.updateComment)
commentRouter.delete('/:commentId', commentController.deleteComment)
commentRouter.get('/:id', commentController.getCommentById)