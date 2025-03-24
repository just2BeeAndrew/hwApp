import {CommentsModel, LikesModel, postsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {CommentDBType, CommentOutputType, LikeStatus} from "../types/db.types";
import {SortType} from "../helpers/paginationValues";
import {ResultStatus} from "../result/resultCode";
import {Result} from "../result/result.type";
import {injectable} from "inversify";

const commentsMapper = (comment: WithId<CommentDBType>): CommentOutputType => {
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
            myStatus: comment.likesInfo.myStatus,
        }
    }
}

@injectable()
export class CommentsQueryRepository {
    async getCommentBy_Id(_id: string) {
        const comment = await CommentsModel.findOne({_id: new ObjectId(_id)});
        if (!comment) return null;
        return commentsMapper(comment);
    }

    async getCommentById(commentId: string, userId: string) {
        const comment = await CommentsModel.findOne({_id: new ObjectId(commentId)});
        if (!comment) return null;
        let userStatus: LikeStatus = LikeStatus.None
        if (userId) {
            const status = await this.getUserStatus(userId, commentId)
            userStatus = status?.status ?? LikeStatus.None
        }
        comment.likesInfo.myStatus = userStatus
        await comment.save()
        return commentsMapper(comment);
    }

    async getCommentsByPostId(postId: string, sortData: SortType): Promise<Result<{
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
        return {
            status: ResultStatus.Success,
            data: {
                pagesCount: Math.ceil(commentsCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: commentsCount,
                items: comments.map(commentsMapper),
            },
            extensions: [],
        };
    }

    async getUserStatus(commentId: string, userId: string) {
        return LikesModel.findOne({commentId: commentId, userId: userId})
    }

    getCommentsCount(postId?: string): Promise<number> {
        const filter: any = {}
        if (postId) {
            filter.postId = postId;
        }
        return CommentsModel.countDocuments(filter)
    }
}