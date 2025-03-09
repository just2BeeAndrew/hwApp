import {Router, Request, Response} from 'express';
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {
    postContentValidator,
    descriptionValidator,
    nameValidator, shortDescriptionValidator, titleValidator,
    websiteUrlValidator
} from "../middlewares/expressValidationMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {BlogInputType, BlogPostInputType} from "../types/db.types";
import {blogsService} from "./blogsService";
import {paginationQueries} from "../helpers/paginationValues";
import {postsService} from "../posts/postsService";
import {blogsQueryRepository} from "./blogsQueryRepository";
import {postsQueryRepository} from "../posts/postsQueryRepository";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/requests";
import {HttpStatuses} from "../types/httpStatuses";

export const blogRouter = Router();

class BlogController {
    async getAllBlogs(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const blogs = await blogsQueryRepository.getAllBlogs(sortData)
        res.status(HttpStatuses.SUCCESS).json(blogs);
    }

    async createBlog(req: Request<BlogInputType>, res: Response) {
        const { name, description, websiteUrl } = req.body;
        const blogId = await blogsService.createBlog(name, description, websiteUrl);
        const blog = await blogsQueryRepository.getBlogBy_Id(blogId)
        res.status(HttpStatuses.CREATED).json(blog);
    }

    async getPostsByBlogId(req: RequestWithParams<{ blogId: string }>, res: Response) {
        const {blogId} = req.params;
        const sortData = paginationQueries(req)
        const posts = await postsQueryRepository.getPostsByBlogId(blogId, sortData)
        if (posts) {
            res.status(HttpStatuses.SUCCESS).json(posts);
            return
        }
        res.sendStatus(HttpStatuses.NOT_FOUND)
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<{ blogId: string }, BlogPostInputType>, res: Response) {
        const {blogId} = req.params;
        const postsId = await postsService.createPost({...req.body, blogId: blogId})
        if (!postsId) {
            res.sendStatus(404)
            return
        }
        const post = await postsQueryRepository.getPostBy_Id(postsId)
        res.status(201).json(post);
    }

    async getBlogById(req: RequestWithParams<{ id: string }>, res: Response) {
        const blogId = await blogsQueryRepository.getBlogBy_Id(req.params.id);
        if (blogId) {
            res.status(200).json(blogId);
            return
        }
        res.sendStatus(404);
    }

    async updateBlog(req: RequestWithParams<{ id: string }>, res: Response) {
        const updatedBlog = await blogsService.updateBlog(req.params.id, req.body);
        if (updatedBlog) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404);
    }

    async deleteBlog(req: Request, res: Response) {
        const deletedBlog = await blogsService.deleteBlog(req.params.id);
        if (deletedBlog) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404)
    }
}

export const blogController = new BlogController()

blogRouter.get('/', blogController.getAllBlogs);
blogRouter.post('/',
    authorizationMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    errorsResultMiddleware,
    blogController.createBlog);
blogRouter.get('/:blogId/posts', blogController.getPostsByBlogId,)
blogRouter.post('/:blogId/posts',
    authorizationMiddleware,
    titleValidator,
    shortDescriptionValidator,
    postContentValidator,
    errorsResultMiddleware,
    blogController.createPostByBlogId);
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


