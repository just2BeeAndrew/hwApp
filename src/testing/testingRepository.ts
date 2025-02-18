import {blogsCollection, commentsCollection, postsCollection, usersCollection,tokensCollection} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll() {
        await Promise.all([
            blogsCollection.deleteMany({}),
            postsCollection.deleteMany({}),
            usersCollection.deleteMany({}),
            commentsCollection.deleteMany({}),
            tokensCollection.deleteMany({}),
        ]);
        console.log("Очищено")
    }
};