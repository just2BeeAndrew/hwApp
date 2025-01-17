import {blogsCollection, postsCollection, usersCollection} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll(): Promise<void> {
        await Promise.all([
            blogsCollection.deleteMany({}),
            postsCollection.deleteMany({}),
            usersCollection.deleteMany({})
        ]);
    }
};