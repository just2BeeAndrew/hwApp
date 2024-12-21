import { Router, Request, Response } from 'express';
import {blogsRepository} from "../repositories/blogsRepository";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {descriptionValidator, nameValidator, websiteUrlValidator} from "../middlewares/expressValidationMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";

export const blogRouter = Router();

export const blogController = {
    getAllBlogs(req:Request, res: Response){
        const blogs = blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    },

    createBlog(req:Request, res: Response) {
        const blog = blogsRepository.createBlog(req.body);
        res.status(201).json(blog);
    },

    getBlogById(req:Request, res: Response) {
        const blogId = blogsRepository.getBlogById(req.params.id);
        if (blogId)
            res.status(200).json(blogId);
        else
            res.status(404);
    },

    updateBlog(req:Request, res: Response) {
        const updatedBlog = blogsRepository.updateBlog(req.params.id,req.body);
        if (updatedBlog)
            res.status(204).json(updatedBlog);
        else res.status(400);

    },
    deleteBlog(req:Request, res: Response) {
        const deletedBlog = blogsRepository.deleteBlog(req.params.id);
        if (deletedBlog)
            res.status(204);
        else
            res.status(404);
    }
}

blogRouter.get('/', blogController.getAllBlogs);
blogRouter.post('/',
    authorizationMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    errorsResultMiddleware,
    blogController.createBlog);
blogRouter.get('/:id', blogController.getBlogById);
blogRouter.put('/:id',
    authorizationMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    errorsResultMiddleware,
    blogController.updateBlog);
blogRouter.delete('/:id',
    authorizationMiddleware
    ,blogController.deleteBlog);


