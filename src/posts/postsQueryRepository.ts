import {SortType} from "../helpers/paginationValues";
import {PostsModel, ReactionForPostsModel} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {LikeStatus, PostDBType, PostOutputType} from "../types/db.types";
import {inject, injectable} from "inversify";
import {BlogsQueryRepository} from "../blogs/blogsQueryRepository";

const postMapper = (post: WithId<PostDBType>, reaction: LikeStatus): PostOutputType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: reaction,
            newestLikes: post.extendedLikesInfo.newestLikes
        }
    }
}

@injectable()
export class PostsQueryRepository {
    constructor(@inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository) {
    }

    async getAllPosts(sortData: SortType, userId: string) {
        const {sortBy, sortDirection, pageSize, pageNumber} = sortData;

        // Получаем посты
        const posts = await PostsModel
            .find()
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec();

        let reactionMap = new Map<string, LikeStatus>();

        if (userId) {
            const reactions = await ReactionForPostsModel.find({
                userId,
                postId: {$in: posts.map(post => post._id.toString())},
            });

            reactionMap = reactions.reduce((map, reaction) => {
                map.set(reaction.postId.toString(), reaction.status);
                return map;
            }, new Map<string, LikeStatus>());
        }

        const postsCount = await this.getPostsCount();

        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts.map(post =>
                postMapper(
                    post,
                    reactionMap.get(post._id.toString()) || LikeStatus.None
                )
            )
        };
    }
    getPostsCount(blogId?: string): Promise<number> {
        const filter: any = {}
        if (blogId) {
            filter.blogId = blogId;
        }
        return PostsModel.countDocuments(filter)
    }

    async getPostById(postId: string, userId?: string) {
        const post = await PostsModel.findOne({_id: new ObjectId(postId)}).lean();
        if (!post) return null

        let userReaction: LikeStatus = LikeStatus.None;

        if (userId) {
            const status = await this.getUserReaction(userId, postId)
        }
        return postMapper(post, userReaction)
    }

    async getPostBy_Id(_id: ObjectId) {
        const posts = await PostsModel.findOne({_id});
        if (!posts) {
            return null
        }
        return postMapper(posts, LikeStatus.None);
    }

    async getPostsByBlogId(blogId: string, sortData: SortType) {
        const blogsIndex = await this.blogsQueryRepository.getBlogBy_Id(blogId);
        if (!blogsIndex) return null

        const {sortBy, sortDirection, pageSize, pageNumber} = sortData;
        const filteredPosts: any = {}
        if (!blogId) {
            return null
        }
        filteredPosts.blogId = blogId;

        const posts = await PostsModel
            .find(filteredPosts)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const postsCount = await this.getPostsCount(blogId)
        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: postsCount,
            items: posts.map(post => postMapper(post, LikeStatus.None)),
        }
    }

    async getUserReaction(userId: string, postId: string) {
        return await ReactionForPostsModel.findOne({userId: userId, postId: postId})
    }
}