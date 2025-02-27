import {app} from '../src/app'
import {agent} from 'supertest'
import {SETTINGS} from "../src/settings";
import {HttpStatuses} from "../src/types/httpStatuses";

export const req = agent(app)



export const deleteAll = async () => {
    await req.delete(`${SETTINGS.PATH.TESTING}`).expect(HttpStatuses.NOCONTENT)
}

export const baseAuthorization = () => {
    const credentials = Buffer.from(`${SETTINGS.BASEAUTH.LOGIN}:${SETTINGS.BASEAUTH.PASSWORD}`).toString('base64');
    return `Basic ${credentials}`
}

export const createAndLoginTestUser = async () => {
    const testUser = {
        login: "adminTest",
        password: "adminTest",
        email: "adminTest@test.com",
    }

    const createUserRes = await req
        .post(SETTINGS.PATH.USERS)
        .set('Authorization', baseAuthorization())
        .send(testUser)
        .expect(HttpStatuses.CREATED);

    const loginRes = await req
        .post(`${SETTINGS.PATH.AUTH}/login`)
        .send({
            loginOrEmail: testUser.login,
            password: testUser.password,
        })
        .expect(HttpStatuses.SUCCESS);
    return {userId: createUserRes.body.userId, accessToken: loginRes.body.accessToken};
};

export const createBlog = async () => {
    const blogRes = await req
        .post(SETTINGS.PATH.BLOGS)
        .set('Authorization', baseAuthorization())
        .send({
            name: "Test Blog",
            description: "This is a test blog",
            websiteUrl: "https://it-incubator.io",
        })
        .expect(HttpStatuses.CREATED);

    return blogRes.body.id;
};

export const createPost = async (blogId: string) => {
    const postRes = await req
        .post(`${SETTINGS.PATH.POSTS}`)
        .set('Authorization', baseAuthorization())
        .send({
            title: "Test Post",
            shortDescription: "Short description",
            content: "This is a test post content",
            blogId: blogId
        })
        .expect(HttpStatuses.CREATED);

    return postRes.body.id;
};

export const createComment = async (postId: string, accessToken: string) => {
    const commentRes = await req
        .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({content: "This is a test comment"})
        .expect(HttpStatuses.CREATED);

    return commentRes.body;
}

