import {db} from "../db/db";
import {Request, Response} from "express";

export const blogsRepository = {
    getAllBlogs(){
        return db.blogs
    },

    createBlog(req:Request, res:Response){
        const blog = db.blogs.find(blog => blog.id === req.params.id);
    },

    getBlogById(){

    },

    updateBlog(){

    },

    deleteBlog(){
        
    }

}