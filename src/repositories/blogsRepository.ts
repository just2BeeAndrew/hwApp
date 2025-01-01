import {db} from "../db/db";
import {BlogInputType, BlogDbType, BlogOutputType} from "../types/db.types";
import {blogsCollection, postsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {SortType} from "../helpers/paginationValues";

const blogMapper = (blog: WithId<BlogDbType>): BlogOutputType => {
    return {
        id: blog.id,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

export const blogsRepository = {
    async getAllBlogs(sortData:SortType) {
        const {searchNameTerm,sortBy,sortDirection, pageSize,pageNumber } = sortData;
        const filter: any = {}//создаем пустой объект
        if (searchNameTerm) {//если searchNameTerm существует то...
            filter.name = {$regex: searchNameTerm, $options: "i"} //присваиваем найденые значения
        }
        const blogs = await blogsCollection //возвращает значения по заданым критериям
            .find(filter)//поиск переменной filter и вывод без поля _id
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})//выполняет сортировку по уюыванию
            .skip((pageNumber - 1) * pageSize)//переход на нужную страницу пропуская указаное количество элементов
            .limit(pageSize)//устанавливает кол-во элементов на странице
            .toArray()
        return blogs.map(blogMapper)//преобразует в массив
    },

    async getBlogsCount(searchNameTerm: string | null): Promise<number> {
        const filter: any = {}
        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: "i"};
        }
        return blogsCollection.countDocuments(filter)
    },

    async createBlog(createdBlog: BlogDbType): Promise<ObjectId> {
        const res = await blogsCollection.insertOne(createdBlog)
        return res.insertedId
    },

    async getPostsByBlogId(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        blogId: string
    ) {
        const filter: any = {}
        filter.blogId = {$regex: blogId};
        return postsCollection
            .find(filter, {projection: {_id: 0}})
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()
    },

    async getBlogById(id: string) {
        const blog = await blogsCollection.findOne({id});
        if (!blog) {
            return null
        }
        return blogMapper(blog);

    },

    async getBlogBy_Id(_id: ObjectId) {
        const blog = await blogsCollection.findOne({_id});
        if (!blog) {
            return null
        }
        return blogMapper(blog);
    },



    async updateBlog(id: string, body: BlogDbType): Promise<boolean> {
        const res = await blogsCollection.updateOne(
            {id},
            {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl,
                }
            }
        )
        return res.matchedCount === 1
    },

    async deleteBlog(id: string): Promise<boolean> {
        const blog = await blogsCollection.findOne({id});
        if (blog) {
            const res = await blogsCollection.deleteOne({_id: blog._id});
            if (res.deletedCount > 0) return true;
        }
        return false
    }
}
