import {Router, Request, Response} from 'express';
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {
    postContentValidator,
    descriptionValidator,
    nameValidator, shortDescriptionValidator, titleValidator,
    websiteUrlValidator
} from "../middlewares/expressValidationMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {BlogInputType, PostInputType,BlogPostInputType} from "../types/db.types";
import {blogsService} from "./blogsService";
import {paginationQueries} from "../helpers/paginationValues";
import {postsService} from "../posts/postsService";
import {blogsQueryRepository} from "./blogsQueryRepository";
import {postsQueryRepository} from "../posts/postsQueryRepository";

export const blogRouter = Router();

export const blogController = {
    async getAllBlogs(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const blogs = await blogsQueryRepository.getAllBlogs(sortData)
        res.status(200).json(blogs);
    },

    async createBlog(req: Request<BlogInputType>, res: Response) {
        const blogId = await blogsService.createBlog(req.body);
        const blog = await blogsQueryRepository.getBlogBy_Id(blogId)
        res.status(201).json(blog);
    },

    async getPostsByBlogId(req: Request<{blogId:string},{},{}>, res: Response) {
        const sortData = paginationQueries(req)
        console.log(sortData)
        const posts = await postsQueryRepository.getPostsByBlogId(req.params.blogId, sortData)
        if (posts){
            res.status(200).json(posts);
            return
        }
        res.sendStatus(404)
    },

    async createPostByBlogId(req: Request<{blogId:string},{},BlogPostInputType>, res: Response) {
        const postsId = await postsService.createPost({...req.body, blogId:req.params.blogId})
        if (!postsId){
            res.sendStatus(404)
            return
        }
        const post = await postsQueryRepository.getPostBy_Id(postsId)
        res.status(201).json(post);
    },

    async getBlogById(req: Request<{id:string}>, res: Response) {
        const blogId = await blogsQueryRepository.getBlogBy_Id(req.params.id);
        if (blogId) {
            res.status(200).json(blogId);
            return
        }
        res.sendStatus(404);
    },

    async updateBlog(req: Request<{id:string}>, res: Response) {
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


