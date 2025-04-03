import {createBlog, createPost, req} from "./test-helper";
import {HttpStatuses} from "../src/types/httpStatuses";
import {SETTINGS} from "../src/settings";
import {runDb} from "../src/db/mongoDb";
import {ObjectId} from "mongodb";

const credentials = Buffer.from(`${SETTINGS.BASEAUTH.LOGIN}:${SETTINGS.BASEAUTH.PASSWORD}`).toString('base64');

describe('/blogs', () => {
    beforeAll(async () => {

        await runDb(SETTINGS.MONGO_URL)
        await req.delete('/testing/all-data/').expect(HttpStatuses.NOCONTENT);
    });

    it('shoud return all blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .query({
                searchNameTerm: "",
                sortBy: "",
                sortDirection: "asc",
                pageNumber: 1,
                pageSize: 10,
            })
            .expect(HttpStatuses.SUCCESS);
        // Проверяем, что объект имеет нужные поля
        expect(res.body).toMatchObject({
            pagesCount: expect.any(Number),
            page: expect.any(Number),
            pageSize: expect.any(Number),
            totalCount: expect.any(Number),
            items: expect.any(Array),
        });

        // Если есть блоги, проверяем структуру первого объекта
        if (res.body.items.length > 0) {
            const firstBlog = res.body.items[0];
            expect(firstBlog).toMatchObject({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String),
                createdAt: expect.any(String), // ISO формат даты
                isMembership: expect.any(Boolean),
            });
            // Дополнительно проверяем, что createdAt - валидная ISO дата
            expect(new Date(firstBlog.createdAt).toISOString()).toBe(firstBlog.createdAt);
        }
    })

    it('should create a new blog and return it with correct structure', async () => {
        // Отправка POST-запроса с данными для нового блога
        const blogId = await createBlog()

        const getRes = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(HttpStatuses.SUCCESS);

        expect(getRes.body).toHaveProperty('id', blogId);

    });

    it('should create a new post by blog id and return it with correct structure', async () => {
        const blogId = await createBlog()
        const postId = await createPost(blogId)
        const getRes = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .query({
                pageNumber: 1,
                pageSize: 10,
                sort: "",
                sortDirection: "desc",
            })
            .expect(HttpStatuses.SUCCESS);
    });

    it('should return 404 for not existing blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS + '1')
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should update an existing blog and return 204 No Content', async () => {
        const blogId = await createBlog()
        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                name: "Updated Blog",
                description: "Updated description",
                websiteUrl: "https://updated-blog.com",
            })
            .expect(HttpStatuses.NOCONTENT);

        const getRes = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(HttpStatuses.SUCCESS);

        expect(getRes.body).toMatchObject({
            id: blogId,
            name: "Updated Blog",
            description: "Updated description",
            websiteUrl: "https://updated-blog.com",
            createdAt: expect.any(String), // Проверяем, что поле существует и это строка
            isMembership: expect.any(Boolean),
        });
    });

    it('should delete an existing blog and return 204 No Content', async () => {
        const blogId = await createBlog()

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', `Basic ${credentials}`)
            .expect(HttpStatuses.NOCONTENT);

        await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should return 404 if trying to delete a non-existent blog', async () => {
        const fakeId = new ObjectId().toString(); // Генерируем случайный валидный ObjectId
        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${fakeId}`)
            .set('Authorization', `Basic ${credentials}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should return 401 Unauthorized if no authorization is provided', async () => {
        const blogId = await createBlog()

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(HttpStatuses.UNAUTHORIZED); // Ожидаем 401 (нет авторизации)
    });
})
