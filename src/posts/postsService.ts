import {LikesDetailsType, LikeStatus, PostDBType, PostInputType, PostsLikesDBType} from "../types/db.types";
import {PostsRepository} from "./postsRepository";
import {inject, injectable} from "inversify";
import {PostsQueryRepository} from "./postsQueryRepository";
import {BlogsQueryRepository} from "../blogs/blogsQueryRepository";
import {ResultStatus} from "../result/resultCode";
import {UsersRepository} from "../users/usersRepository";
import {PostsModel} from "../db/mongoDb";
import {ObjectId} from "mongodb";

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
    ) {}


    async likeStatusForPosts(userId: string, postId: string, newReaction: LikeStatus) {
        const postExist = await this.postsRepository.getPostBy_Id(postId)
        if (!postExist) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Couldn't find post",
                extensions: [{field: "post", message: "Not Found"}],
            }
        }

        const user = await this.usersRepository.getUserBy_Id(userId)
        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: "Couldn't find user",
                extensions: [{field: "user", message: "Not Found"}],
            }
        }

        const {login} = user.accountData
        const {likesCount, dislikesCount} = postExist.extendedLikesInfo

        const existingReaction = await this.postsRepository.findReaction(userId, postId)
        const currentReaction = existingReaction?.status ?? LikeStatus.None

        if (existingReaction) {
            if (existingReaction.status === newReaction) {
                return {
                    status: ResultStatus.Success,
                    data: null,
                    extensions: [],
                }
            } else {
                await this.postsRepository.updateReaction(existingReaction._id, newReaction)
            }
        } else if (newReaction !== LikeStatus.None) {
            const reaction = new PostsLikesDBType(userId, login, postId, newReaction, new Date().toISOString())
            await this.postsRepository.createReaction(reaction)
        }

        const updatedCounts = await this.calculateReactionCount(likesCount, dislikesCount, currentReaction, newReaction);

        await this.postsRepository.updateReactionCounter(postId, updatedCounts.likesCount, updatedCounts.dislikesCount);

        const newestLikes: LikesDetailsType[] = await this.postsRepository.getNewestLikesByPostId(postId)

        const post = await PostsModel.findById({_id: new ObjectId(postId)})
        if (!post) {
            throw new Error("No post found with id " + postId)
        }

        post.extendedLikesInfo.newestLikes = newestLikes

        await post.save()

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    }

    async createPost(createData: PostInputType) {
        const blogsIndex = await this.blogsQueryRepository.getBlogBy_Id(createData.blogId);
        if (!blogsIndex) return null

        const newPost = new PostDBType (
            createData.title,
            createData.shortDescription,
            createData.content,
            createData.blogId,
            blogsIndex.name,
            new Date().toISOString(),
        {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatus.None,
            newestLikes: []
        }
    )
        return await this.postsRepository.createPost(newPost);

    }

    async updatePost(id:string, updateData: PostInputType) {
        const blogsIndex = await this.blogsQueryRepository.getBlogBy_Id(updateData.blogId);
        if (!blogsIndex) throw new Error("blog index not found");

        return await this.postsRepository.updatePost(id, updateData, blogsIndex);
    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id);
    }

    async calculateReactionCount(likesCount: number, dislikesCount: number, existingReaction: LikeStatus, newReaction: LikeStatus): Promise<{
        likesCount: number,
        dislikesCount: number
    }> {
        if (existingReaction === LikeStatus.Like && newReaction !== LikeStatus.Like) {
            likesCount -= 1;
        }
        if (existingReaction === LikeStatus.Dislike && newReaction !== LikeStatus.Dislike) {
            dislikesCount -= 1;
        }
        if (newReaction === LikeStatus.Like && existingReaction !== LikeStatus.Like) {
            likesCount += 1;
        }
        if (newReaction === LikeStatus.Dislike && existingReaction !== LikeStatus.Dislike) {
            dislikesCount += 1;
        }

        return {likesCount, dislikesCount}
    }
}
