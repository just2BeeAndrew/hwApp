import request from "supertest"
import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {SETTINGS} from "../src/settings";
import {runDb} from "../src/db/mongoDb";
import {req} from "./test-helper";

describe("likes/dislikes flow", () =>{

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
        //await runDb.run(mongoServer.getUri());
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })




})
