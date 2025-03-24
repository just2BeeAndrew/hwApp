import {
    blogsCollection,
    postsCollection,
    UserModelClass,
    tokensCollection,
    devicesCollection,
    CommentsModel
} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll() {
        await Promise.all([
            blogsCollection.deleteMany({}),
            postsCollection.deleteMany({}),
            UserModelClass.deleteMany({}),
            CommentsModel.deleteMany({}),
            tokensCollection.deleteMany({}),
            devicesCollection.deleteMany({}),
        ]);
        console.log("Очищено")
    }
};