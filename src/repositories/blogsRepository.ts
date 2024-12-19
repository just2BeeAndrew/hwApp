import {db} from "../db/db";
import {BlogType} from "../types/db.types";


export const blogsRepository = {
    getAllBlogs(){
        return db.blogs
    },

    createBlog(body:BlogType) {
        const blog: BlogType = {
            id: Math.random().toString(),
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        db.blogs = [...db.blogs, blog];
        return blog;
    },

    getBlogById(id:string){
        return db.blogs.find(blog => blog.id === id);
    },

    updateBlog(id:string,body:BlogType) {
        const blog = db.blogs.find(blog => blog.id == id);
        if (blog){
            blog.name = body.name ? body.name : blog.name;
            blog.description = body.description ? body.description : blog.description;
            blog.websiteUrl = body.websiteUrl ? body.websiteUrl : blog.websiteUrl;

            return blog;
        }
        return false;
    },

    deleteBlog(id:string){
        for (let i = 0; i < db.blogs.length; i++){
            if (db.blogs[i].id === id){
                db.blogs.splice(i, 1);
                return true;
            }
        }return false



    }
}
