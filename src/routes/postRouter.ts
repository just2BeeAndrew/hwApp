import {Router, Request, Response} from 'express';
import {postsRepository} from "../repositories/postsRepository";
import {blogIdValidator, contentValidator, shortDescriptionValidator, titleValidator} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {ObjectId} from "mongodb";
import {blogRepository} from "../repositories/blogRepository";

export const postRouter = Router();

export const postController = {
    async getAllPosts(req: Request, res: Response) {
        const posts = await postsRepository.getAllPosts();
        res.status(200).send(posts);
    },

    async createPost(req: Request, res: Response) {
        const postId = await postsRepository.createPost(req.body);
        const post = await postsRepository.getPostBy_Id(postId);
        res.status(201).send(post);
    },

    async getPostById(req: Request, res: Response) {
        const postId = await postsRepository.getPostById(req.params.id);
        if (postId)
        {
            res.status(200).send(postId);
            return
        }
        res.sendStatus(404)
    },

    async updatePost(req: Request, res: Response) {
        const updatedPost = await postsRepository.updatePost(req.params.id, req.body);
        if (updatedPost) {
            res.status(204).json(updatedPost);
            return;
        }
        res.sendStatus(404)
    },

    async deletePost(req:Request, res: Response) {
        const deletedPost = await postsRepository.deletePost(req.params.id);
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
    contentValidator,
    blogIdValidator,
    errorsResultMiddleware,
    postController.createPost);
postRouter.get('/:id', postController.getPostById);
postRouter.put('/:id',
    authorizationMiddleware,
    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,
    errorsResultMiddleware,
    postController.updatePost);
postRouter.delete('/:id',
    authorizationMiddleware,
    postController.deletePost);