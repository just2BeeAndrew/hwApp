import {Router, Request, Response} from 'express';
import {postsRepository} from "../repositories/postsRepository";;

export const postRouter = Router();

export const postController = {
    getAllPosts(req: Request, res: Response) {
        const posts = postsRepository.getAllPosts();

    },

    createPost(req: Request, res: Response) {
        const post = postsRepository.createPost(req.body);
        res.status(201).send(post);
    },

    getPostById(req: Request, res: Response) {
        const postId = postsRepository.getPostById(req.params.id);
        if (postId)
            res.status(200).send(postId);
        else
            res.status(404)
    },

    updatePost(req: Request, res: Response) {
        const updatedPost = postsRepository.updatePost(req.params.id, req.body);
        if (updatedPost)
            res.status(200).json(updatedPost);
        else res.status(400)
    },

    deletePost(req: Request, res: Response) {
        const deletedPost = postsRepository.deletePost(req.params.id);
        if (deletedPost)
            res.status(204)
        else
            res.status(404)
    }
}

postRouter.get('/', postController.getAllPosts);
postRouter.post('/', postController.createPost);
postRouter.get('/:id', postController.getPostById);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);