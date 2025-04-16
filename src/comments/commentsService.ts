import {ResultStatus} from "../result/resultCode";
import {CommentDBType, LikesDBType, LikeStatus, UserDBType} from "../types/db.types";
import {CommentsRepository} from "./commentsRepository";
import {PostsRepository} from "../posts/postsRepository";
import {UsersRepository} from "../users/usersRepository";
import {WithId} from "mongodb";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository
    ) {
    }

    async createComment(postId: string, createData: string, userId: string) {
        const userInfo: WithId<UserDBType> | null = await this.usersRepository.getUserBy_Id(userId);
        if (!userInfo) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "User not found",
                extensions: [{field: 'User', message: 'Not Found'}],
            };
        }

        const post = await this.postsRepository.getPostBy_Id(postId);
        if (!post) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Post not found",
                extensions: [{field: 'Post', message: 'Not Found'}],
            };
        }

        const newComment = new CommentDBType(
            postId,
            createData,
            {
                userId: userInfo._id.toString(),
                userLogin: userInfo.accountData.login,
            },
            new Date().toISOString(),
        )
        const res = await this.commentsRepository.createComment(newComment);
        return {
            status: ResultStatus.Success,
            data: res,
            extensions: [],
        };
    }

    async likeStatus(commentId: string, userId: string, newStatus: LikeStatus) {
        const commentExist = await this.commentsRepository.getCommentBy_Id(commentId);
        if (!commentExist) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Could not find comment",
                extensions: [{field: "comment", message: "Not Found"}],
            };
        }

        const {likesCount, dislikesCount} = commentExist.likesInfo

        const existingLike = await this.commentsRepository.findStatus(userId, commentId);
        const currentStatus = existingLike?.status ?? LikeStatus.None

        if (existingLike) {
            if (existingLike.status === newStatus) {
                return {
                    status: ResultStatus.Success,
                    data: null,
                    extensions: [],
                };
            } else {
                await this.commentsRepository.updateStatus(existingLike._id, newStatus)
            }
        } else if (newStatus !== LikeStatus.None) {
            const status = new LikesDBType(userId, commentId, newStatus);
            await this.commentsRepository.createStatus(status);
        }

        const updatedCounts = await this.calculateStatusCount(likesCount, dislikesCount, currentStatus, newStatus);

        await this.commentsRepository.updateStatusCounter(commentId, updatedCounts.likesCount, updatedCounts.dislikesCount);

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    }

    async updateComment(commentId: string, updateComment: string, userId: string) {
        const checkerResult = await this.checkIsExistingComment(commentId);

        if (checkerResult.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Comment not found",
                extensions: [{field: 'comment', message: 'Not Found'}],
            }
        }
        const commentatorId = checkerResult.data!.commentatorInfo.userId

        const isOwner = await this.checkIsOwnerComment(commentatorId, userId)
        if (isOwner.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
                errorMessage: "User isn't owner",
                extensions: [{field: 'user', message: "Isn't owner"}],
            }
        }

        const result = await this.commentsRepository.updateComment(commentId, updateComment);
        if (!result) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Comment not found",
                extensions: [{field: 'comment', message: 'Not Found'}],
            }
        }
        return {
            status: ResultStatus.NoContent,
            data: null,
            extensions: []
        }
    }

    async deleteComment(commentId: string, userId: string) {
        const isExist = await this.checkIsExistingComment(commentId);
        if (isExist.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Comment not found",
                extensions: [{field: 'comment', message: 'Not Found'}],
            }
        }
        const commentatorId = isExist.data!.commentatorInfo.userId

        const isOwner = await this.checkIsOwnerComment(commentatorId, userId)
        if (isOwner.status !== ResultStatus.Success) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
                errorMessage: "User isn't owner",
                extensions: [{field: 'user', message: "Isn't owner"}],
            }
        }

        await this.commentsRepository.deleteComment(commentId);
        return {
            status: ResultStatus.NoContent,
            data: null,
            extensions: []

        }
    }

    async checkIsExistingComment(commentId: string) {
        const comment = await this.commentsRepository.getCommentBy_Id(commentId);
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Not Found",
                extensions: [{field: "commentId", message: "NotFound"}]
            }
        }
        return {
            status: ResultStatus.Success,
            data: comment,
            extensions: [],
        }
    }

    async checkIsOwnerComment(commentatorId: string, userId: string) {
        if (commentatorId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                data: null,
                errorMessage: "User isn't owner",
                extensions: [{field: " user", message: "Isn't owner"}],
            }
        }
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        }
    }

    async calculateStatusCount(likesCount: number, dislikesCount: number, existingStatus: LikeStatus, newStatus: LikeStatus): Promise<{
        likesCount: number,
        dislikesCount: number
    }> {
        if (existingStatus === LikeStatus.Like && newStatus !== LikeStatus.Like) {
            likesCount -= 1;
        }
        if (existingStatus === LikeStatus.Dislike && newStatus !== LikeStatus.Dislike) {
            dislikesCount -= 1;
        }
        if (newStatus === LikeStatus.Like && existingStatus !== LikeStatus.Like) {
            likesCount += 1;
        }
        if (newStatus === LikeStatus.Dislike && existingStatus !== LikeStatus.Dislike) {
            dislikesCount += 1;
        }

        return {likesCount, dislikesCount}
    }
}