import {tokensCollection} from "../db/mongoDb";

export const authRepository = {
    async isBlacklisted(refreshToken: string): Promise<boolean> {
        const result = await tokensCollection.findOne({refreshToken: refreshToken})
        if (result) {
            return true
        }
        return false
    },

    async addTokenInBlacklist(refreshToken: string) {
        const expiredToken = await tokensCollection.insertOne({refreshToken: refreshToken});
        return expiredToken.insertedId.toString();
    }
}