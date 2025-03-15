import {Router} from 'express';
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {
    descriptionValidator,
    nameValidator,
    postContentValidator,
    shortDescriptionValidator,
    titleValidator,
    websiteUrlValidator
} from "../middlewares/expressValidationMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {container} from "../composition-root";
import {BlogsController} from "./blogsController";

const blogsController = container.get(BlogsController);

export const blogRouter = Router();


blogRouter.get('/', blogsController.getAllBlogs.bind(blogsController));
blogRouter.post('/',
    authorizationMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    errorsResultMiddleware,
    blogsController.createBlog.bind(blogsController));
blogRouter.get('/:blogId/posts', blogsController.getPostsByBlogId.bind(blogsController));
blogRouter.post('/:blogId/posts',
    authorizationMiddleware,
    titleValidator,
    shortDescriptionValidator,
    postContentValidator,
    errorsResultMiddleware,
    blogsController.createPostByBlogId.bind(blogsController));
blogRouter.get('/:id', blogsController.getBlogById.bind(blogsController));
blogRouter.put('/:id',
    authorizationMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    errorsResultMiddleware,
    blogsController.updateBlog.bind(blogsController));
blogRouter.delete('/:id',
    authorizationMiddleware,
    blogsController.deleteBlog.bind(blogsController));


