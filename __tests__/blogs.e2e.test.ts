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

    it('shoud create all blogs', () => {

    })

    it('should return 404 for not existing blogs', async () => {
        const res = await req
            .get(SETTINGS.PATH.BLOGS + '1')
            .expect(HttpStatuses.NOT_FOUND);
    })
})
