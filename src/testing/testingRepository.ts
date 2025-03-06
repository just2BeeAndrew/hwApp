import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    usersCollection,
    tokensCollection,
    devicesCollection
} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll() {
        await Promise.all([
            blogsCollection.deleteMany({}),
            postsCollection.deleteMany({}),
            usersCollection.deleteMany({}),
            commentsCollection.deleteMany({}),
            tokensCollection.deleteMany({}),
            devicesCollection.deleteMany({}),
        ]);
        console.log("Очищено")
    }
};