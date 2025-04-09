import request from "supertest"
import {MongoMemoryServer} from "mongodb-memory-server";
import {SETTINGS} from "../src/settings";
import {dropMongoDb, runMongoDb, stopMongoDb} from "../src/db/mongoDb";
import {initApp} from "../src/app";
import {HttpStatuses} from "../src/types/httpStatuses";
import {createAndLoginTestUser, createBlog, createComment, createPost} from "./test-helper";

describe("likes/dislikes flow", () => {
    let accessToken: string;
    let userId
    const app = initApp()

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await runMongoDb(mongoServer.getUri());
        const user = await createAndLoginTestUser()
        userId = user.userId
        accessToken = user.accessToken;
    })

    beforeEach(async () => {
        await dropMongoDb();
    })

    afterAll(async () => {
        await stopMongoDb();
    })

    it('should delete all', async () => {
        await request(app).delete(SETTINGS.PATH.TESTING).expect(HttpStatuses.NOCONTENT);
    })

    it('should create comment and add reaction', async () => {
        const blogId = await createBlog();
        const postId = await createPost(blogId);
        const comment = await createComment(postId, accessToken);
        console.log(comment)
        const commentId = comment.id;
        console.log(commentId)
        const resPut = await request(app)
            .put(`${SETTINGS.PATH.COMMENTS}/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({likeStatus: "Dislike"})
            .expect(HttpStatuses.NOCONTENT);

        console.log('Response from PUT request:', resPut.body);

        const resGet = await request(app)
            .get(`${SETTINGS.PATH.COMMENTS}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatuses.SUCCESS);

        console.log('Response from GET comment:', resGet.body);
        expect(resGet.body.likesInfo.myStatus).toBe("Dislike");

        expect(resGet.body.likesInfo.dislikesCount).toBe(1);

        const resPostGet = await request(app)
            .get(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatuses.SUCCESS);

        console.log('Comments for post', resPostGet.body);
    })


})
