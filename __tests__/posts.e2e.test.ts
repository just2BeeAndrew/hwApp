import {createAndLoginTestUser, createBlog, createPost, deleteAll, req} from "./test-helper";
import {HttpStatuses} from "../src/types/httpStatuses";
import {SETTINGS} from "../src/settings";
import {runDb} from "../src/db/mongoDb";
import {ObjectId} from "mongodb";

describe(`${SETTINGS.PATH.POSTS}`, () => {
    let accessToken;
    let userId;

    beforeAll(async () => {
        await runDb(SETTINGS.MONGO_URL)
        await deleteAll();
        ({userId, accessToken} = await createAndLoginTestUser())
    })

    it('should create a new post', async () => {
        const blogId = await createBlog()
        const createdPostId = await createPost(blogId)

        const getRes = await req
            .get(`${SETTINGS.PATH.POSTS}/${createdPostId}`)
            .expect(HttpStatuses.SUCCESS);

        expect(getRes.body).toHaveProperty('id', createdPostId);
    });

    it('should return all posts', async () => {
        const res = await req
            .get('/posts')
            .expect(HttpStatuses.SUCCESS);

        expect(res.body).toHaveProperty('items');
        expect(Array.isArray(res.body.items)).toBe(true);
    });

    it('should return 404 for non-existent post', async () => {
        await req
            .get(`/posts/${new ObjectId().toString()}`)
            .expect(HttpStatuses.NOT_FOUND);
    });

    it('should update a post', async () => {
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

        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Test Post",
                shortDescription: "Short description",
                content: "This is a test post content",
                blogId: blogId
            })
            .expect(HttpStatuses.CREATED);

        createdPostId = res.body.id;

        await req
            .put(`/posts/${createdPostId}`)
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Updated Post",
                shortDescription: "Updated description",
                content: "Updated content",
                blogId: blogId
            })
            .expect(HttpStatuses.NOCONTENT);
    });

    it('should delete a post', async () => {
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

        const res = await req
            .post('/posts')
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Test Post",
                shortDescription: "Short description",
                content: "This is a test post content",
                blogId: blogId
            })
            .expect(HttpStatuses.CREATED);

        createdPostId = res.body.id;

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

        const postRes = await req
            .post('/posts')
            .set('Authorization', `Basic ${credentials}`)
            .send({
                title: "Test Post for Comments",
                shortDescription: "Short description",
                content: "This is a test post content",
                blogId: blogId
            })
            .expect(HttpStatuses.CREATED);

        const postId = postRes.body.id;

        console.log("тестовый токен", accessToken)

        const commentRes = await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                content: "This is a test comment"
            })
            .expect(HttpStatuses.CREATED);

        expect(commentRes.body).toHaveProperty('content', "This is a test comment");

        const res = await req
            .get(`/posts/${postId}/comments`)
            .expect(HttpStatuses.SUCCESS);

        expect(res.body).toHaveProperty('items');
        expect(res.body.items.length).toBeGreaterThan(0);
    });

})