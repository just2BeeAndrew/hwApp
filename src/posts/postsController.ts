import {RequestWithParams, RequestWithParamsAndBody} from "../types/requests";
import {Request, Response} from "express";
import {paginationQueries} from "../helpers/paginationValues";
import {CommentsQueryRepository} from "../comments/commentsQueryRepository";
import {ResultStatus} from "../result/resultCode";
import {resultCodeToHttpException} from "../result/resultCodeToHttpException";
import {HttpStatuses} from "../types/httpStatuses";
import {CommentInputType, LikeStatus, PostInputType} from "../types/db.types";
import {CommentsService} from "../comments/commentsService";
import {PostsQueryRepository} from "./postsQueryRepository";
import {PostsService} from "./postsService";
import {inject, injectable} from "inversify";

@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) protected postsService: PostsService,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(CommentsService) protected commentsService: CommentsService,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    ) {
    }

    async likeStatusForPost(req: RequestWithParamsAndBody<{ postId: string }, { likeStatus: LikeStatus }>, res: Response) {
        const userId = req.user!.id as string;
        const {postId} = req.params;
        const {likeStatus} = req.body;

        if (!Object.values(LikeStatus).includes(likeStatus)) {
            res.status(HttpStatuses.BAD_REQUEST).json({
                errorsMessages: [
                    {
                        message: 'Invalid status value',
                        field: 'likeStatus',
                    }
                ]
            });
            return;
        }

        const result = await this.postsService.likeStatusForPosts(userId, postId, likeStatus)
        if (result.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(result.status))
                .send(result.extensions)
            return
        }
        res.sendStatus(HttpStatuses.NOCONTENT)
    }

    async getCommentsByPostId(req: RequestWithParams<{ postId: string }>, res: Response) {
        const sortData = paginationQueries(req)
        const {postId} = req.params;
        const userId = req.user?.id as string;
        const comments = await this.commentsQueryRepository.getCommentsByPostId(postId, sortData, userId);
        if (comments.status !== ResultStatus.Success) {
            res
                .status(resultCodeToHttpException(comments.status))
                .json(comments.extensions)
            return
        }
        res
            .status(HttpStatuses.SUCCESS)
            .json(comments.data)
    }

    async createComment(req: RequestWithParamsAndBody<{ postId: string }, CommentInputType>, res: Response) {
        const {postId} = req.params;
        const {content} = req.body;
        const userId = req.user?.id as string;

        if (!postId) {
            res.status(HttpStatuses.NOT_FOUND);
            return
        }

        const createdComment = await this.commentsService.createComment(postId, content, userId);
        if (createdComment.status !== ResultStatus.Success) {
            res
                .sendStatus(404)
            return
        }
        const newComment = await this.commentsQueryRepository.getCommentBy_Id(createdComment.data!);
        res
            .status(HttpStatuses.CREATED)
            .json(newComment);
    }

    async getAllPosts(req: Request, res: Response) {
        const userId = req.user?.id as string;
        const sortData = paginationQueries(req)
        const posts = await this.postsQueryRepository.getAllPosts(sortData, userId);
        res.status(200).send(posts);
    }

    async createPost(req: Request<PostInputType>, res: Response) {
        const postId = await this.postsService.createPost(req.body);
        if (!postId) {
            res.sendStatus(404)
            return;
        }
        const post = await this.postsQueryRepository.getPostBy_Id(postId);
        res.status(201).send(post);


    }

    async getPostById(req: RequestWithParams<{id: string}>, res: Response) {
        const userId = req.user?.id as string;
        const {id} = req.params;
        const post = await this.postsQueryRepository.getPostById(id, userId);
        if (post) {
            res.status(200).send(post);
            return;
        }
        res.sendStatus(404)
    }

    async updatePost(req: RequestWithParamsAndBody<{ id: string }, PostInputType>, res: Response) {
        const {id} = req.params;
        const updatedPost = await this.postsService.updatePost(id, req.body);
        if (updatedPost) {
            res.status(204).json(updatedPost);
            return;
        }
        res.sendStatus(404)
    }

    async deletePost(req: Request, res: Response) {
        const deletedPost = await this.postsService.deletePost(req.params.id);
        if (deletedPost) {
            res.sendStatus(204);
            return
        }
        res.sendStatus(404)
    }
}