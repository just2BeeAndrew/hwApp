import {app} from "../src/app";
import express from "express";
import {agent} from "supertest";
import {HttpStatuses} from "../src/types/httpStatuses";
import {SETTINGS} from "../src/settings";
import {runDb} from "../src/db/mongoDb";

export const req = agent(app)

describe('/blogs', () => {
    beforeAll(async () => {
        await runDb(SETTINGS.MONGO_URL)
        await req.delete('/testing/all-data/').expect(HttpStatuses.NOCONTENT);

    });

    it('shoud return all blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .query({
                searchNameTerm:"",
                sortBy:"",
                sortDirection:"asc",
                pageNumber:1,
                pageSize:10,
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


    it('should return 404 for not existing blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS + '1')
            .expect(HttpStatuses.NOT_FOUND);
    })
})
