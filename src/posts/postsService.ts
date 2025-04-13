import {LikeStatus, PostDBType, PostInputType} from "../types/db.types";
import {PostsRepository} from "./postsRepository";
import {inject, injectable} from "inversify";
import {PostsQueryRepository} from "./postsQueryRepository";
import {BlogsQueryRepository} from "../blogs/blogsQueryRepository";

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository
    ) {}


    async likeStatusForPosts(userId: string, postId: string, likeStatus: LikeStatus) {

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
            new Date().toISOString()
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
}
