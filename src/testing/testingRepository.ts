import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    UserModelClass,
    tokensCollection,
    devicesCollection
} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll() {
        await Promise.all([
            blogsCollection.deleteMany({}),
            postsCollection.deleteMany({}),
            UserModelClass.deleteMany({}),
            commentsCollection.deleteMany({}),
            tokensCollection.deleteMany({}),
            devicesCollection.deleteMany({}),
        ]);
        console.log("Очищено")
    }
};