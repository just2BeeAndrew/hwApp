import {db} from "../db/db";
import {BlogInputType, BlogDbType} from "../types/db.types";
import {blogsCollection} from "../db/mongoDb";
import {ObjectId} from "mongodb";


export const blogRepository = {
    async getAllBlogs(
        searchNameTerm: string | null,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        pageNumber: number,
        pageSize: number
    ){
        return await blogsCollection.find({},{projection:{_id:0}}).toArray()
    },

    async getBlogsCount(searchNameTerm: string | null): Promise<number> {
        const filter:any = {}
        if (searchNameTerm){
            filter.title = {$regex:searchNameTerm,$options:"i"};
        }
        return blogsCollection.countDocuments(filter)
    },

    async createBlog(createData:BlogInputType):Promise<ObjectId> {
        const blog:BlogDbType = {
            id: Math.random().toString(),
            name: createData.name,
            description: createData.description,
            websiteUrl: createData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const res = await blogsCollection.insertOne(blog)
        return res.insertedId
    },

    async getBlogById(id:string){
        return await blogsCollection.findOne({id},{projection:{_id:0}});
    },

    async getBlogBy_Id(_id:ObjectId){
        return await blogsCollection.findOne({_id},{projection:{_id:0}});
    },

    async updateBlog(id:string,body:BlogDbType):Promise<boolean> {
        const res = await blogsCollection.updateOne(
            {id},
            {$set:{ name:body.name,
                    description:body.description,
                    websiteUrl:body.websiteUrl,}}
        )
        return res.matchedCount === 1
    },

    async deleteBlog(id:string):Promise<boolean> {
        const blog = await blogsCollection.findOne({id});
        if (blog){
            const res = await blogsCollection.deleteOne({_id: blog._id});
            if(res.deletedCount > 0) return true;
        }
        return false
    }
}
