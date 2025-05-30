import {
    BlogsModel,
    PostsModel,
    UserModelClass,
    tokensCollection,
    devicesCollection,
    CommentsModel
} from "../db/mongoDb";

export const testingRepository = {
    async deleteAll() {
        await Promise.all([
            BlogsModel.deleteMany({}),
            PostsModel.deleteMany({}),
            UserModelClass.deleteMany({}),
            CommentsModel.deleteMany({}),
            tokensCollection.deleteMany({}),
            devicesCollection.deleteMany({}),
        ]);
        console.log("Очищено")
    }
};