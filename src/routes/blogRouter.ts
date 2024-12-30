import {Router, Request, Response} from 'express';
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {descriptionValidator, nameValidator, websiteUrlValidator} from "../middlewares/expressValidationMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {ObjectId, SortDirection} from "mongodb";
import {BlogInputType} from "../types/db.types";
import {blogsService} from "../domains/blogsService";

import {blogsRepository} from "../repositories/blogsRepository";
import {paginationQueries} from "../helpers/paginationValues";
import {postsService} from "../domains/postsService";

export const blogRouter = Router();

export const blogController = {
    async getAllBlogs(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const blogs = await blogsService.getAllBlogs(sortData)
        res.status(200).json(blogs);
    },

    async createBlog(req: Request<BlogInputType>, res: Response) {
        const blogId = await blogsService.createBlog(req.body);
        const blog = await blogsService.getBlogBy_Id(blogId)
        res.status(201).json(blog);
    },

    async getPostsByBlogId(req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req)
        const posts = await postsService.getPostsByBlogId(req.params.blogId)
        if (posts){
            res.status(200).json(posts);
            return
        }
        res.sendStatus(404)

    },

    async createPostByBlogId(req: Request, res: Response) {

    },

    async getBlogById(req: Request, res: Response) {
        const blogId = await blogsService.getBlogById(req.params.id);
        if (blogId) {
            res.status(200).json(blogId);
            return
        }
        res.sendStatus(404);
    },

    async updateBlog(req: Request, res: Response) {
        const updatedBlog = await blogsService.updateBlog(req.params.id, req.body);
        if (updatedBlog) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404);
    },

    async deleteBlog(req: Request, res: Response) {
        const deletedBlog = await blogsService.deleteBlog(req.params.id);
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
blogRouter.get('/:blogId/posts', blogController.getPostsByBlogId,)
blogRouter.post('/:blogId/posts', blogController.createPostByBlogId);
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


