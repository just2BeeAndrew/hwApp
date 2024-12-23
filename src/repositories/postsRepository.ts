import {db} from "../db/db";
import {PostType,BlogType} from "../types/db.types";
import {postsCollection} from "../db/mongoDb";


export const postsRepository = {
    async getAllPosts(){
        return await postsCollection.find().toArray()
        //return db.posts;
    },

    async createPost(body:PostType){
        const blogsIndex = db.blogs.findIndex(index => index.id === body.blogId);
        const post: PostType = {
            id: Math.random().toString(),
            title : body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: db.blogs[blogsIndex].name,
            createdAt: new Date().toISOString()
        }
        db.posts = [...db.posts,post];
        return post;
    },

    async getPostById(id:string){
        return db.posts.find(post => post.id === id);
    },

    async updatePost(id:string, body:PostType){
        const post = db.posts.find(post => post.id == id);
        if(post){
            post.title = body.title;
            post.shortDescription = body.shortDescription;
            post.content = body.content;
            post.blogId = body.blogId;
            return post;
        }
        return false;
    },

    async deletePost(id:string){
        for (let i = 0; i < db.posts.length; i++){
            if (db.posts[i].id == id){
                db.posts.splice(i, 1);
                return true;
            }
        }
        return false
    }
}