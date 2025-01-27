import {Router, Request, Response} from 'express';
import {blogIdValidator, postContentValidator, shortDescriptionValidator, titleValidator} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {PostInputType} from "../types/db.types";
import {postsService} from "./postsService";
import {paginationQueries} from "../helpers/paginationValues";
import {postsQueryRepository} from "./postsQueryRepository";

export const postRouter = Router();

export const postController = {
    async getAllPosts(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const posts = await postsQueryRepository.getAllPosts(sortData);
        res.status(200).send(posts);
    },

    async createPost(req: Request<PostInputType>, res: Response) {
        const postId = await postsService.createPost(req.body);
        if (!postId) {
            res.sendStatus(404)
            return;
        }
        const post = await postsQueryRepository.getPostBy_Id(postId);
        res.status(201).send(post);


    },

    async getPostById(req: Request, res: Response) {
        const postId = await postsQueryRepository.getPostById(req.params.id);
        if (postId)
        {
            res.status(200).send(postId);
            return;
        }
        res.sendStatus(404)
    },

    async updatePost(req: Request<{id:string},{},PostInputType>, res: Response) {
        const updatedPost = await postsService.updatePost(req.params.id, req.body);
        if (updatedPost) {
            res.status(204).json(updatedPost);
            return;
        }
        res.sendStatus(404)
    },

     async deletePost(req:Request, res: Response) {
        const deletedPost = await postsService.deletePost(req.params.id);
        if (deletedPost){
            res.sendStatus(204);
            return
        }
        res.sendStatus(404)
    }
}

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