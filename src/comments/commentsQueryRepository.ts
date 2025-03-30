import {CommentsModel, LikesModel, postsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {CommentDBType, CommentOutputType, LikeStatus} from "../types/db.types";
import {SortType} from "../helpers/paginationValues";
import {ResultStatus} from "../result/resultCode";
import {Result} from "../result/result.type";
import {inject, injectable} from "inversify";
import {CommentsRepository} from "./commentsRepository";

const commentsMapper = (comment: WithId<CommentDBType>, status: LikeStatus): CommentOutputType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
        likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus:status,
        }
    }
}

@injectable()
export class CommentsQueryRepository {
    constructor(@inject(CommentsRepository) protected commentsRepository: CommentsRepository) {
    }

    async getCommentBy_Id(_id: string) {
        const comment = await CommentsModel.findOne({_id: new ObjectId(_id)});
        if (!comment) return null;
        return commentsMapper(comment, LikeStatus.None);
    }

    async getCommentById(commentId: string, userId?: string) {
        console.log("userId", userId, commentId);
        const comment = await CommentsModel.findOne({_id: new ObjectId(commentId)});
        if (!comment) return null;

        let userStatus: LikeStatus = LikeStatus.None;

        if (userId) {
            const status = await this.getUserStatus(userId, commentId);
            userStatus = status?.status ?? LikeStatus.None;
        }

        console.log(`User ${userId || "anonymous"} has status ${userStatus} on comment ${commentId}`);

        return commentsMapper(comment, userStatus);
    }

    async getCommentsByPostId(postId: string, sortData: SortType, userId: string): Promise<Result<{
        pagesCount: number;
        page: number;
        pageSize: number;
        totalCount: number;
        items: CommentOutputType[];
    } | null>> {
        if (!ObjectId.isValid(postId)) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: "Invalid postId",
                extensions: [{field: "postId", message: "Invalid ObjectId"}],
            };
        }

        const isExistingPost = await postsCollection.findOne({_id: new ObjectId(postId)});
        if (!isExistingPost) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Post not found",
                extensions: [{field: "postId", message: "Not Found"}],
            };
        }

        const {pageNumber, pageSize, sortBy, sortDirection} = sortData;
        const [comments, commentsCount] = await Promise.all([
            CommentsModel
                .find({postId})
                .sort({[sortBy]: sortDirection === "asc" ? 1 : -1})
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize),
            this.getCommentsCount(postId),
        ]);

        let statusMap: Map<string, LikeStatus> = new Map();

        if (userId) {
            const statuses = await LikesModel.find({
                userId,
                commentId: { $in: comments.map(comment => comment._id.toString()) },
            });

            statusMap = statuses.reduce((map, status) => {
                map.set(status.commentId, status.status);
                return map;
            }, new Map<string, LikeStatus>());
        }

        return {
            status: ResultStatus.Success,
            data: {
                pagesCount: Math.ceil(commentsCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: commentsCount,
                items: comments.map(comment => commentsMapper(comment, statusMap.get(comment._id.toString()) ?? LikeStatus.None)),
            },
            extensions: [],
        };
    }

    async getUserStatus(userId: string, commentId: string) {
        console.log(`Searching like status for comment=${commentId}, user=${userId}`);

        const likeStatus = await LikesModel.findOne({
            userId: userId,
            commentId: commentId,
        }).lean();

        console.log(`Found like status:`, likeStatus);
        return likeStatus;
    }

    getCommentsCount(postId?: string): Promise<number> {
        const filter: any = {}
        if (postId) {
            filter.postId = postId;
        }
        return CommentsModel.countDocuments(filter)
    }
}