import {Router} from 'express';
import {
    blogIdValidator,
    commentContentValidator,
    postContentValidator,
    shortDescriptionValidator,
    titleValidator
} from "../middlewares/expressValidationMiddleware";
import {errorsResultMiddleware} from "../middlewares/errorsResultMiddleware";
import {authorizationMiddleware} from "../middlewares/authorizationMiddleware";
import {accessTokenMiddleware} from "../middlewares/accessTokenMiddleware";
import {container} from "../composition-root";
import {PostsController} from "./postsController";
import {authChecker} from "../middlewares/authChecker";

const postsController = container.get(PostsController);

export const postRouter = Router();


postRouter.get('/:postId/comments',
    authChecker,
    errorsResultMiddleware,
    postsController.getCommentsByPostId.bind(postsController));
postRouter.post('/:postId/comments',
    accessTokenMiddleware,
    commentContentValidator,
    errorsResultMiddleware,
    postsController.createComment.bind(postsController));
postRouter.get('/', postsController.getAllPosts.bind(postsController));
postRouter.post('/',
    authorizationMiddleware,
    titleValidator,
    shortDescriptionValidator,
    postContentValidator,
    blogIdValidator,
    errorsResultMiddleware,
    postsController.createPost.bind(postsController));
postRouter.get('/:id', postsController.getPostById.bind(postsController));
postRouter.put('/:id',
    authorizationMiddleware,
    titleValidator,
    shortDescriptionValidator,
    postContentValidator,
    blogIdValidator,
    errorsResultMiddleware,
    postsController.updatePost.bind(postsController));
postRouter.delete('/:id',
    authorizationMiddleware,
    errorsResultMiddleware,
    postsController.deletePost.bind(postsController));