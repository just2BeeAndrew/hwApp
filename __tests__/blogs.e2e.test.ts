import {req} from "./test-helper";
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
        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                name: "Test Blog",
                description: "This is a test blog",
                websiteUrl: "https://it-incubator.io",
            })
            .expect(HttpStatuses.CREATED);

        // Проверяем, что ответ содержит нужную структуру
        expect(res.body).toMatchObject({
            id: expect.any(String),
            name: "Test Blog",
            description: "This is a test blog",
            websiteUrl: "https://it-incubator.io",
            createdAt: expect.any(String), // Проверяем, что это строка
            isMembership: expect.any(Boolean),
        });

        // Проверяем, что поле createdAt валидно
        expect(new Date(res.body.createdAt).toISOString()).toBe(res.body.createdAt);

        // Получаем все блоги и проверяем, что только что созданный появился в списке
        const allBlogsRes = await req.get(SETTINGS.PATH.BLOGS).expect(HttpStatuses.SUCCESS);
        expect(allBlogsRes.body.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: res.body.id,
                    name: "Test Blog",
                    description: "This is a test blog",
                    websiteUrl: "https://it-incubator.io",
                }),
            ])
        );
    });

    it('should create a new post by blog id and return it with correct structure', async () => {
        // Сначала создаем блог, чтобы получить blogId
        const blogRes = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                name: "Test Blog",
                description: "This is a test blog",
                websiteUrl: "https://it-incubator.io",
            })
            .expect(HttpStatuses.CREATED);

        const blogId = blogRes.body.id; // Достаем id созданного блога

        // Создаем новый пост, используя blogId
        const postRes = await req
            .post(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`) // Вставляем реальный blogId
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Test Post",
                shortDescription: "Short description of post",
                content: "Full content of the post",
            })
            .expect(HttpStatuses.CREATED);

        // Проверяем, что ответ содержит нужную структуру
        expect(postRes.body).toMatchObject({
            id: expect.any(String),
            title: "Test Post",
            shortDescription: "Short description of post",
            content: "Full content of the post",
            blogId: blogId, // Связываем пост с блогом
            blogName: expect.any(String), // Должно подтягиваться название блога
            createdAt: expect.any(String),
        });
        // Вызываем созданый пост
        const getRes = await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}/posts`)
            .query({
                pageNumber: 1,
                pageSize: 10,
                sort: "",
                sortDirection: "desc",
            })
            .expect(HttpStatuses.SUCCESS);
        expect(getRes.body).toMatchObject({
            pagesCount: expect.any(Number),
            page: expect.any(Number),
            pageSize: expect.any(Number),
            totalCount: expect.any(Number),
            items: expect.any(Array),
        })
    });

    it('should return 404 for not existing blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS + '1')
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should update an existing blog and return 204 No Content', async () => {
        // 1. Создаем новый блог
        const createRes = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                name: "Original Blog",
                description: "Original description",
                websiteUrl: "https://original-blog.com",
            })
            .expect(HttpStatuses.CREATED);

        const blogId = createRes.body.id; // Достаем id созданного блога

        // 2. Отправляем PUT-запрос на обновление блога
        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogId}`) // Вставляем ID блога в URL
            .set('Authorization', `Basic ${credentials}`)
            .send({
                name: "Updated Blog",
                description: "Updated description",
                websiteUrl: "https://updated-blog.com",
            })
            .expect(HttpStatuses.NOCONTENT); // Ожидаем статус 204 (успешное обновление без контента)

        // 3. Получаем блог по ID и проверяем, что данные обновились
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
        // 1. Создаем новый блог
        const createRes = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                name: "Test Blog",
                description: "Test Description",
                websiteUrl: "https://test-blog.com",
            })
            .expect(HttpStatuses.CREATED);

        const blogId = createRes.body.id; // Достаем id созданного блога

        // 2. Удаляем блог
        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .set('Authorization', `Basic ${credentials}`)
            .expect(HttpStatuses.NOCONTENT); // Ожидаем статус 204 (успешное удаление)

        // 3. Проверяем, что блог действительно удален (ожидаем 404 при запросе)
        await req
            .get(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should return 404 if trying to delete a non-existent blog', async () => {
        // Пытаемся удалить блог с несуществующим ID
        const fakeId = new ObjectId().toString(); // Генерируем случайный валидный ObjectId
        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${fakeId}`)
            .set('Authorization', `Basic ${credentials}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should return 401 Unauthorized if no authorization is provided', async () => {
        // Создаем новый блог
        const createRes = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                name: "Test Blog",
                description: "Test Description",
                websiteUrl: "https://test-blog.com",
            })
            .expect(HttpStatuses.CREATED);

        const blogId = createRes.body.id; // Достаем id созданного блога

        // Пытаемся удалить блог без авторизации
        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogId}`)
            .expect(HttpStatuses.UNAUTHORIZED); // Ожидаем 401 (нет авторизации)
    });
})
