import {createComment,baseAuthorization, createAndLoginTestUser, createBlog, createPost, req} from "./test-helper";
import {HttpStatuses} from "../src/types/httpStatuses";
import {SETTINGS} from "../src/settings";
import {runMongoDb} from "../src/db/mongoDb";
import {ObjectId} from "mongodb";
import mongoose from "mongoose";

describe(`/posts`, () => {
    let accessToken: string;
    let userId

    beforeAll(async () => {
        await runMongoDb(SETTINGS.MONGO_URL)
        await mongoose.connect(SETTINGS.MONGO_URL)
        await req.delete('/testing/all-data/').expect(HttpStatuses.NOCONTENT);
        const user = await createAndLoginTestUser()
        userId = user.userId
        accessToken = user.accessToken;
    },30000)

    afterAll(async () => {
        await mongoose.connection.close();
    })

    it('should create a new post', async () => {
        const blogId = await createBlog()
        const postId = await createPost(blogId)

        const getRes = await req
            .get(`${SETTINGS.PATH.POSTS}/${postId}`)
            .expect(HttpStatuses.SUCCESS);

        expect(getRes.body).toHaveProperty('id', postId);
    });

    it('should return all posts', async () => {
        const res = await req
            .get(`${SETTINGS.PATH.POSTS}`)
            .expect(HttpStatuses.SUCCESS);

        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBe(true);
    });

    it('should return 404 for non-existent post', async () => {
        await req
            .get(`${SETTINGS.PATH.POSTS}/${new ObjectId().toString()}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should update a post', async () => {
        const blogId = await createBlog()
        const postId = await createPost(blogId)

        await req
            .put(`${SETTINGS.PATH.POSTS}/${postId}`)
            .set('Authorization', baseAuthorization())
            .send({
                title: "Updated Post",
                shortDescription: "Updated description",
                content: "Updated content",
                blogId: blogId
            })
            .expect(HttpStatuses.NOCONTENT);
    });

    it('should delete a post', async () => {
        const blogId = await createBlog()
        const postId = await createPost(blogId)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${postId}`)
            .set('Authorization', baseAuthorization())
            .expect(HttpStatuses.NOCONTENT);
    });

    it('should return 404 when deleting non-existent post', async () => {
        await req
            .delete(`${SETTINGS.PATH.POSTS}/${new ObjectId().toString()}`)
            .set('Authorization', baseAuthorization())
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should create a comment for a post', async () => {
        const blogId = await createBlog()
        const postId = await createPost(blogId)
        const comment = await createComment(postId, accessToken)

        expect(comment).toHaveProperty('content', "This is a test comment");

        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .expect(HttpStatuses.SUCCESS);

        expect(res.body).toHaveProperty('items');
        expect(res.body.items.length).toBeGreaterThan(0);
    });
})