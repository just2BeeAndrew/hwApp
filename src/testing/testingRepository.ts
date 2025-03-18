import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    UserModel,
    tokensCollection,
    devicesCollection
} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll() {
        await Promise.all([
            blogsCollection.deleteMany({}),
            postsCollection.deleteMany({}),
            UserModel.deleteMany({}),
            commentsCollection.deleteMany({}),
            tokensCollection.deleteMany({}),
            devicesCollection.deleteMany({}),
        ]);
        console.log("Очищено")
    }
};