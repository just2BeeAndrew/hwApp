import {SortType} from "../helpers/paginationValues";
import {blogsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {BlogDbType, BlogOutputType} from "../types/db.types";

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

export const blogsQueryRepository = {
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
        const blogsCount = await blogsCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(blogsCount / sortData.pageSize),
            page: sortData.pageNumber,
            pageSize:sortData.pageSize,
            totalCount: blogsCount,
            items: blogs.map(blogMapper),
        }

    },

    // async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    //     const filter: any = {}
    //     if (searchNameTerm) {
    //         filter.name = {$regex: searchNameTerm, $options: "i"};
    //     }
    //     return blogsCollection.countDocuments(filter)
    // },

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
}