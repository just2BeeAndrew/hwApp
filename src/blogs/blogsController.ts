import {Request, Response} from "express";
import {paginationQueries} from "../helpers/paginationValues";
import {HttpStatuses} from "../types/httpStatuses";
import {BlogInputType, BlogPostInputType} from "../types/db.types";
import {BlogsService} from "./blogsService";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/requests";
import {inject, injectable} from "inversify";
import {BlogsQueryRepository} from "./blogsQueryRepository";
import {PostsQueryRepository} from "../posts/postsQueryRepository";
import {PostsService} from "../posts/postsService";

@injectable()
export class BlogsController {
    constructor(
        @inject(BlogsService) protected blogsService: BlogsService,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsService) protected postsService: PostsService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository
    ) {}

    async getAllBlogs(req: Request, res: Response) {
        const sortData = paginationQueries(req)
        const blogs = await this.blogsQueryRepository.getAllBlogs(sortData)
        res.status(HttpStatuses.SUCCESS).json(blogs);
    }

    async createBlog(req: Request<BlogInputType>, res: Response) {
        const {name, description, websiteUrl} = req.body;
        const blogId = await this.blogsService.createBlog(name, description, websiteUrl);
        const blog = await this.blogsQueryRepository.getBlogBy_Id(blogId)
        res.status(HttpStatuses.CREATED).json(blog);
    }

    async getPostsByBlogId(req: RequestWithParams<{ blogId: string }>, res: Response) {
        const {blogId} = req.params;
        const userId = req.user?.id as string;
        const sortData = paginationQueries(req)
        const posts = await this.postsQueryRepository.getPostsByBlogId(blogId, sortData, userId)
        if (posts) {
            res.status(HttpStatuses.SUCCESS).json(posts);
            return
        }
        res.sendStatus(HttpStatuses.NOT_FOUND)
    }

    async createPostByBlogId(req: RequestWithParamsAndBody<{ blogId: string }, BlogPostInputType>, res: Response) {
        const {blogId} = req.params;
        const postsId = await this.postsService.createPost({...req.body, blogId: blogId})
        if (!postsId) {
            res.sendStatus(404)
            return
        }
        const post = await this.postsQueryRepository.getPostBy_Id(postsId)
        res.status(201).json(post);
    }

    async getBlogById(req: RequestWithParams<{ id: string }>, res: Response) {
        const blogId = await this.blogsQueryRepository.getBlogBy_Id(req.params.id);
        if (blogId) {
            res.status(200).json(blogId);
            return
        }
        res.sendStatus(404);
    }

    async updateBlog(req: RequestWithParams<{ id: string }>, res: Response) {
        const updatedBlog = await this.blogsService.updateBlog(req.params.id, req.body);
        if (updatedBlog) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404);
    }

    async deleteBlog(req: Request, res: Response) {
        const deletedBlog = await this.blogsService.deleteBlog(req.params.id);
        if (deletedBlog) {
            res.sendStatus(204);
            return;
        }
        res.sendStatus(404)
    }
}