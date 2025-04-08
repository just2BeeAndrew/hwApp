import request from "supertest"
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {SETTINGS} from "../src/settings";
import {dropMongoDb, runMongoDb, stopMongoDb} from "../src/db/mongoDb";
import {req} from "./test-helper";
import {initApp} from "../src/app";

describe("likes/dislikes flow", () =>{
    const app = initApp()

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        await runMongoDb(mongoServer.getUri());
    })

    beforeEach(async () => {
        await dropMongoDb();
    })

    afterAll(async () => {
        await stopMongoDb();
    })

    it('should delete all', async() =>{

    })




})
