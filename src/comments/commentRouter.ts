import {Request, Response, Router} from 'express';

export const commentRouter = Router();

export const commentController = {
    async updateComment (req: Request, res: Response) {

    },

    async deleteComment (req: Request, res: Response) {

    },

    async getCommentById (req: Request, res: Response) {

    }

}

commentRouter.put('/:commentId',commentController.updateComment)
commentRouter.delete('/:commentId', commentController.deleteComment)
commentRouter.get('/:id', commentController.getCommentById)