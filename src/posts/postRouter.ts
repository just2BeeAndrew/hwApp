import {Router, Request, Response} from 'express';
import {
    blogIdValidator, commentContentValidator,
    postContentValidator,
    shortDescriptionValidator,
    titleValidator
} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {CommentInputType, PostInputType} from "../types/db.types";
import {postsService} from "./postsService";
import {paginationQueries} from "../helpers/paginationValues";
import {postsQueryRepository} from "./postsQueryRepository";
import {commentsQueryRepository} from "../comments/commentsQueryRepository";
import {commentsService} from "../comments/commentsService";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/requests";
import {ResultStatus} from "../result/resultCode";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";


export const postRouter = Router();

class PostsController {
    async getCommentsByPostId(req: RequestWithParams<{ postId: string }>, res: Response) {
        const sortData = paginationQueries(req)
        const {postId} = req.params;
        const comments = await commentsQueryRepository.getCommentsByPostId(postId, sortData);
        if (comments.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(comments.status))
                .json(comments.extensions)
            return
        }
        res
            .status(HttpStatuses.SUCCESS)
            .json(comments.data)
    }

    async createComment(req: RequestWithParamsAndBody<{ postId: string }, CommentInputType>, res: Response) {
        const {postId} = req.params;
        const {content} = req.body;
        const userId = req.user?.id as string;

        if(!postId){
            res.status(HttpStatuses.NOT_FOUND);
            return
        }

        const createdComment = await commentsService.createComment(postId, content, userId);
        if (createdComment.status !== ResultStatus.Success) {
            res
                .sendStatus(404)
            return
        }
        const newComment = await commentsQueryRepository.getCommentBy_Id(createdComment.data!);
        res
            .status(HttpStatuses.CREATED)
            .json(newComment);
    }

    async getAllPosts(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const posts = await postsQueryRepository.getAllPosts(sortData);
        res.status(200).send(posts);
    }

    async createPost(req: Request<PostInputType>, res: Response) {
        const postId = await postsService.createPost(req.body);
        if (!postId) {
            res.sendStatus(404)
            return;
        }
        const post = await postsQueryRepository.getPostBy_Id(postId);
        res.status(201).send(post);


    }

    async getPostById(req: Request, res: Response) {
        const postId = await postsQueryRepository.getPostById(req.params.id);
        if (postId) {
            res.status(200).send(postId);
            return;
        }
        res.sendStatus(404)
    }

    async updatePost(req: RequestWithParamsAndBody<{ id: string }, PostInputType>, res: Response) {
        const {id} = req.params;
        const updatedPost = await postsService.updatePost(id, req.body);
        if (updatedPost) {
            res.status(204).json(updatedPost);
            return;
        }
        res.sendStatus(404)
    }

    async deletePost(req: Request, res: Response) {
        const deletedPost = await postsService.deletePost(req.params.id);
        if (deletedPost) {
            res.sendStatus(204);
            return
        }
        res.sendStatus(404)
    }
}

export const postController = new PostsController();

postRouter.get('/:postId/comments', postController.getCommentsByPostId);
postRouter.post('/:postId/comments',
    accessTokenMiddleware,
    commentContentValidator,
    errorsResultMiddleware,
    postController.createComment);
postRouter.get('/', postController.getAllPosts);
postRouter.post('/',
    authorizationMiddleware,
    titleValidator,
    shortDescriptionValidator,
    postContentValidator,
    blogIdValidator,
    errorsResultMiddleware,
    postController.createPost);
postRouter.get('/:id', postController.getPostById);
postRouter.put('/:id',
    authorizationMiddleware,
    titleValidator,
    shortDescriptionValidator,
    postContentValidator,
    blogIdValidator,
    errorsResultMiddleware,
    postController.updatePost);
postRouter.delete('/:id',
    authorizationMiddleware,
    errorsResultMiddleware,
    postController.deletePost);