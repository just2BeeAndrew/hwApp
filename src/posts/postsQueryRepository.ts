import {SortType} from "../helpers/paginationValues";
import {PostsModel, ReactionForPostsModel, UserModelClass} from "../db/mongoDb";
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
        const posts = await PostsModel
            .find()
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .exec()
        const postsCount = await this.getPostsCount()


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

        if(userId) {
            const status = await this.getUserReaction(userId, postId)
        }





        // const reactions = await ReactionForPostsModel.find({
        //     postId: id
        // }).populate('userId', 'accountData.login').lean();
        //
        // // Разделяем лайки и дизлайки
        // const likes = reactions.filter(r => r.status === 'Like');
        // const dislikes = reactions.filter(r => r.status === 'Dislike');
        //
        // // Получаем последние 3 лайка
        // const newestLikes = likes
        //     .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
        //     .slice(0, 3)
        //     .map(like => ({
        //         addedAt: like.addedAt,
        //         userId: like.userId,
        //         login: (like.userId as any).accountData.login
        //     }));
        //
        // // Определяем статус текущего пользователя
        // const myStatus = userId
        //     ? reactions.find(r => r.userId === userId)?.status || 'None'
        //     : 'None';
        //
        // // Формируем результат с использованием postMapper
        // return {
        //     ...postMapper(post),
        //     extendedLikesInfo: {
        //         likesCount: likes.length,
        //         dislikesCount: dislikes.length,
        //         myStatus,
        //         newestLikes
        //     }
        // };
    }

    async getPostBy_Id(_id: ObjectId) {
        const posts = await PostsModel.findOne({_id});
        if (!posts) {
            return null
        }
        return postMapper(posts);
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
        const postsCount = await this.getPostsCount(blogId)
        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: postsCount,
            items: posts.map(postMapper),
        }
    }

    async getUserReaction(userId: string, postId: string) {
return await ReactionForPostsModel.findOne({userId: userId, postId: postId })
    }
}