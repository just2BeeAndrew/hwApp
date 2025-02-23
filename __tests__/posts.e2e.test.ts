import {app} from "../src/app";
import express from "express";
import {agent} from "supertest";
import {HttpStatuses} from "../src/types/httpStatuses";
import {SETTINGS} from "../src/settings";
import {runDb} from "../src/db/mongoDb";
import {ObjectId} from "mongodb";

export const req = agent(app)

const credentials = Buffer.from(`${SETTINGS.BASEAUTH.LOGIN}:${SETTINGS.BASEAUTH.PASSWORD}`).toString('base64');
let createdPostId: string;

describe('/posts', () => {
    beforeAll(async () => {
        await runDb(SETTINGS.MONGO_URL)
        await req.delete('/testing/all-data/').expect(HttpStatuses.NOCONTENT);
    })

    it('should create a new post', async () => {
        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Test Post",
                shortDescription: "Short description",
                content: "This is a test post content",
                blogId: new ObjectId().toString() // Генерируем валидный ID блога
            })
            .expect(HttpStatuses.CREATED);

        createdPostId = res.body.id;
        expect(res.body).toMatchObject({
            id: expect.any(String),
            title: "Test Post",
            shortDescription: "Short description",
            content: "This is a test post content",
            blogId: expect.any(String),
            createdAt: expect.any(String),
        });
    });

    it('✅ should return all posts', async () => {
        const res = await req
            .get('/posts')
            .expect(HttpStatuses.SUCCESS);

        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBe(true);
    });

    it('should return a post by ID', async () => {
        const res = await req
            .get(`/posts/${createdPostId}`)
            .expect(HttpStatuses.SUCCESS);

        expect(res.body).toHaveProperty('id', createdPostId);
    });

    it('should return 404 for non-existent post', async () => {
        await req
            .get(`/posts/${new ObjectId().toString()}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should update a post', async () => {
        await req
            .put(`/posts/${createdPostId}`)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Updated Post",
                shortDescription: "Updated description",
                content: "Updated content",
                blogId: new ObjectId().toString()
            })
            .expect(HttpStatuses.NOCONTENT);
    });

    it('should delete a post', async () => {
        await req
            .delete(`/posts/${createdPostId}`)
            .set('Authorization', `Basic ${credentials}`)
            .expect(HttpStatuses.NOCONTENT);
    });

    it('should return 404 when deleting non-existent post', async () => {
        await req
            .delete(`/posts/${new ObjectId().toString()}`)
            .set('Authorization', `Basic ${credentials}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should create a comment for a post', async () => {
        const postRes = await req
            .post('/posts')
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Test Post for Comments",
                shortDescription: "Short description",
                content: "This is a test post content",
                blogId: new ObjectId().toString()
            })
            .expect(HttpStatuses.CREATED);

        const postId = postRes.body.id;

        const commentRes = await req
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer some-valid-token`) // Используйте accessTokenMiddleware
            .send({
                content: "This is a test comment"
            })
            .expect(HttpStatuses.CREATED);

        expect(commentRes.body).toHaveProperty('content', "This is a test comment");
    });

    it('should get comments by post ID', async () => {
        const postRes = await req
            .post('/posts')
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Test Post for Comments",
                shortDescription: "Short description",
                content: "This is a test post content",
                blogId: new ObjectId().toString()
            })
            .expect(HttpStatuses.CREATED);

        const postId = postRes.body.id;

        await req
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer some-valid-token`)
            .send({ content: "Another comment" })
            .expect(HttpStatuses.CREATED);

        const res = await req
            .get(`/posts/${postId}/comments`)
            .expect(HttpStatuses.SUCCESS);

        expect(res.body).toHaveProperty('items');
        expect(res.body.items.length).toBeGreaterThan(0);
    });

})