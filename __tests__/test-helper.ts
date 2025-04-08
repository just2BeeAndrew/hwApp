import {initApp} from '../src/app'
import {agent} from 'supertest'
import {SETTINGS} from "../src/settings";
import {HttpStatuses} from "../src/types/httpStatuses";
import {UserModelClass} from "../src/db/mongoDb";
import bcrypt from 'bcryptjs';
import {v4 as uuidv4} from "uuid";

const app = initApp();

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
    };

    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    const createdUser = await UserModelClass.create({
        accountData: {
            login: testUser.login,
            email: testUser.email,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString(),
        },
        emailConfirmation: {
            isConfirm: true,
            confirmationCode: uuidv4(),
            expirationDate: new Date(Date.now() + 3600000).toISOString(),
            issuedAt: new Date().toISOString(),
        },
    });

    console.log("Created user:", createdUser);

    const loginResponse = await req
        .post("/auth/login")
        .set("User-Agent", "Test-Agent")
        .send({
            loginOrEmail: "adminTest",
            password: "adminTest",
        })
        .expect(HttpStatuses.SUCCESS);

    expect(loginResponse.body).toHaveProperty("accessToken");

    return {userId: createdUser._id, accessToken: loginResponse.body.accessToken};
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

