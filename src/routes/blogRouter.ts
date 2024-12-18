import { Router, Request, Response } from 'express';
import {blogsRepository} from "../repositories/blogsRepository";

export const blogRouter = Router();

export const blogController = {
    getAllBlogs(req:Request, res: Response){
        const blogs = blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    },

    createBlog() {

    },

    getBlogById() {

    },

    updateBlog() {

    },
    deleteBlog() {

    }

}

blogRouter.get('/', blogController.getAllBlogs);
blogRouter.post('/', blogController.createBlog);
blogRouter.get('/:id', blogController.getBlogById);
blogRouter.put('/:id', blogController.updateBlog);
blogRouter.delete('/:id',blogController.deleteBlog);


