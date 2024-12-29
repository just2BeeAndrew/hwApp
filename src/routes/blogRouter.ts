import {Router, Request, Response} from 'express';
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {descriptionValidator, nameValidator, websiteUrlValidator} from "../middlewares/expressValidationMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {ObjectId, SortDirection} from "mongodb";
import {BlogInputType} from "../types/db.types";
import {blogService} from "../domains/blogsService";
import {blogRepository} from "../repositories/blogRepository";
import {paginationQueries} from "../helpers/paginationValues";

export const blogRouter = Router();

export const blogController = {
    async getAllBlogs(req: Request, res: Response) {
        const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = paginationQueries(req)
        const blogs = await blogService.getAllBlogs(
            searchNameTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        )
        res.status(200).json(blogs);
    },

    async createBlog(req: Request<BlogInputType>, res: Response) {
        const blogId = await blogService.createBlog(req.body);
        const blog = await blogService.getBlogBy_Id(blogId)
        res.status(201).json(blog);
    },

    async getPostsByBlogId(req: Request, res: Response) {
        const {pageNumber, pageSize, sortBy, sortDirection} = paginationQueries(req)
        const posts = await postService.getPostsByBlogId(req.params.blogId)
        if (posts){
            res.status(200).json(posts);
            return
        }
        res.sendStatus(404)

    },

    async createPostByBlogId(req: Request, res: Response) {

    },

    async getBlogById(req: Request, res: Response) {
        const blogId = await blogService.getBlogById(req.params.id);
        if (blogId) {
            res.status(200).json(blogId);
            return
        }
        res.sendStatus(404);
    },

    async updateBlog(req: Request, res: Response) {
        const updatedBlog = await blogService.updateBlog(req.params.id, req.body);
        if (updatedBlog) {
            res.sendStatus(204);
            return;
        }

        res.sendStatus(404);
    },

    async deleteBlog(req: Request, res: Response) {
        const deletedBlog = await blogService.deleteBlog(req.params.id);
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


