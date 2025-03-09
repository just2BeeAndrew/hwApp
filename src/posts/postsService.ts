import { PostDBType, PostInputType} from "../types/db.types";
import {postsRepository} from "./postsRepository";
import {blogsQueryRepository} from "../blogs/blogsQueryRepository";

class PostsService {
    async createPost(createData: PostInputType) {
        const blogsIndex = await blogsQueryRepository.getBlogBy_Id(createData.blogId);
        if (!blogsIndex) return null

        const post: PostDBType = {
            title: createData.title,
            shortDescription: createData.shortDescription,
            content: createData.content,
            blogId: createData.blogId,
            blogName: blogsIndex.name,
            createdAt: new Date().toISOString()
        }
        return await postsRepository.createPost(post);

    }

    async updatePost(id:string, updateData: PostInputType) {
        const blogsIndex = await blogsQueryRepository.getBlogBy_Id(updateData.blogId);
        if (!blogsIndex) throw new Error("blog index not found");

        return await postsRepository.updatePost(id, updateData, blogsIndex);
    }

    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id);
    }
}

export const postsService = new PostsService();