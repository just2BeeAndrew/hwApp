import {Router, Request, Response} from 'express';
import {blogsRepository} from "../repositories/blogsRepository";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {descriptionValidator, nameValidator, websiteUrlValidator} from "../middlewares/expressValidationMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {ObjectId} from "mongodb";
import {BlogInputType} from "../types/db.types";

export const blogRouter = Router();

export const blogController = {
    async getAllBlogs(req: Request, res: Response) {
        const blogs = await blogsRepository.getAllBlogs();
        res.status(200).json(blogs);
    },

    async createBlog(req: Request<BlogInputType>, res: Response) {
        const blogCreateData:BlogInputType = req.body;
        const blogId = await blogsRepository.createBlog(req.body);
        const blog = await blogsRepository.getBlogBy_Id(blogId)
        res.status(201).json(blog);
    },

    async getBlogById(req: Request, res: Response) {
        const blogId = await blogsRepository.getBlogById(req.params.id);
        if (blogId) {
            res.status(200).json(blogId);
            return
        }
        res.sendStatus(404);
    },

    async updateBlog(req: Request, res: Response) {
        const updatedBlog = await blogsRepository.updateBlog(req.params.id, req.body);
        if (updatedBlog) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(404);
    },

    async deleteBlog(req: Request, res: Response) {
        const deletedBlog = await blogsRepository.deleteBlog(req.params.id);
        if (deletedBlog) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404)
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
    authorizationMiddleware,
    blogController.deleteBlog);


