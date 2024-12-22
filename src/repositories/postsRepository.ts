import {db} from "../db/db";
import {PostType,BlogType} from "../types/db.types";
import {blogsRepository} from "./blogsRepository";


export const postsRepository = {
    getAllPosts(){
        return db.posts;
    },

    createPost(body:PostType){
        const blogsIndex = db.blogs.findIndex(index => index.id === body.blogId);
        const post: PostType = {
            id: Math.random().toString(),
            title : body.title,
            shortDescription: body.shortDescription,
            content: body.content,
            blogId: body.blogId,
            blogName: db.blogs[blogsIndex].name
        }
        db.posts = [...db.posts,post];
        return post;
    },

    getPostById(id:string){
        return db.posts.find(post => post.id === id);
    },

    updatePost(id:string, body:PostType){
        const post = db.posts.find(post => post.id == id);
        if(post){
            post.title = body.title ? body.title : post.title;
            post.shortDescription = body.shortDescription ? body.shortDescription : post.shortDescription;
            post.content = body.content ? body.content : post.content;
            post.blogId = body.blogId ? body.blogId : post.blogId;
            return post;
        }
        return false;
    },

    deletePost(id:string){
        for (let i = 0; i < db.posts.length; i++){
            if (db.posts[i].id == id){
                db.posts.splice(i, 1);
                return true;
            }
        }
        return false
    }
}