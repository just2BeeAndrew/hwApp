import { Router, Request, Response } from 'express';
import {postsPepository} from "../repositories/postsPepository";

export const postRouter = Router();

export const postController = {
    getAllPosts(){

    },

    createPost() {

    },

    getPostById() {

    },

    updatePost() {

    },

    deletePost() {

    }

}

postRouter.get('/', postController.getAllPosts);
postRouter.post('/', postController.createPost);
postRouter.get('/:id', postController.getPostById);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);