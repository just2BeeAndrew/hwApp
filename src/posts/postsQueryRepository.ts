import {SortType} from "../helpers/paginationValues";
import {PostsModel, ReactionForPostsModel, UserModelClass} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {LikeStatus, PostDBType, PostOutputType} from "../types/db.types";
import {inject, injectable} from "inversify";
import {BlogsQueryRepository} from "../blogs/blogsQueryRepository";

const postMapper = (post: WithId<PostDBType>): PostOutputType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
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

        const postId = posts.map(post => post._id.toString())

        const allReactions = await ReactionForPostsModel.find({
            postId: {$in: postId}
        }).lean();
        console.log("all Reactions", allReactions);

// создаю массив и преобразую в новую уникальную коллекцию в которой хранятся все пользователи со значением Like
        const userIdForNewestLikes = Array.from(new Set(
            allReactions
                .filter(r => r.status === 'Like')
                .map(r => r.userId)
        ));

        console.log("userIdForNewestLikes", userIdForNewestLikes);

        const users = await UserModelClass.find(
            {_id: {$in: userIdForNewestLikes}},
            {'accountData.login': 1}
        ).lean();

        const usersMap = users.reduce((map, user) => {
            map.set(user._id.toString(), user.accountData.login);
            return map;
        }, new Map<string, string>());

        console.log("usersMap", usersMap);

        const reactionsByPostId = allReactions.reduce((map, reaction) => {
            const postId = reaction.postId;
            if (!map.has(postId)) {
                map.set(postId, []);
            }
            map.get(postId)!.push(reaction);
            return map;
        }, new Map<string, typeof allReactions>());

        console.log("reactionsByPostId", reactionsByPostId);

        const myStatusMap = userId ? allReactions.reduce((map, reaction) => {
            if (reaction.userId === userId) {
                map.set(reaction.postId, reaction.status);
            }
            return map;
        }, new Map<string, LikeStatus>()) : new Map<string, LikeStatus>();

        console.log("myStatusMap", myStatusMap)

        // Формируем итоговый ответ
        const items = posts.map(post => {
            const postId = post._id.toString();
            const postReactions = reactionsByPostId.get(postId) || [];

            // Разделяем лайки и дизлайки
            const { likes, dislikes } = postReactions.reduce((acc, reaction) => {
                if (reaction.status === 'Like') acc.likes.push(reaction);
                if (reaction.status === 'Dislike') acc.dislikes.push(reaction);
                return acc;
            }, { likes: [] as typeof allReactions, dislikes: [] as typeof allReactions });

            // Получаем последние 3 лайка с логинами
            const newestLikes = likes
                .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
                .slice(0, 3)
                .map(like => ({
                    addedAt: like.addedAt,
                    userId: like.userId,
                    login: usersMap.get(like.userId) || 'unknown'
                }));

            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likes.length,
                    dislikesCount: dislikes.length,
                    myStatus: myStatusMap.get(postId) || 'None',
                    newestLikes
                }
            };
        });

        return {
            pagesCount: Math.ceil(postsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize: sortData.pageSize,
            totalCount: postsCount,
            items: items,
        }
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

    }
}