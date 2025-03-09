import {SortType} from "../helpers/paginationValues";
import {blogsCollection} from "../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {BlogDBType, BlogOutputType} from "../types/db.types";

const blogMapper = (blog: WithId<BlogDBType>): BlogOutputType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    }
}

class BlogsQueryRepository {
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
    }

    async getBlogBy_Id(_id: string) {
        const blog = await blogsCollection.findOne({_id: new ObjectId(_id)});
        if (!blog) {
            return null
        }
        return blogMapper(blog);
    }
}

export const blogsQueryRepository = new BlogsQueryRepository();