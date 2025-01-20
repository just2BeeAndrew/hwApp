import {UserDBType} from "../types/db.types";
import {WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(user: WithId<UserDBType>) {
        const token = jwt.sign({id: user._id}, SETTINGS.JWT_SECRET, {expiresIn: "1h"});
        return {accessToken: token};
    },

    async getUserIdByToken(token: string):Promise<string | null> {
        try {
            const result:any = jwt.verify(token, SETTINGS.JWT_SECRET);
            const userId = result.id;
            if (typeof userId !== "string") {
                return null;
            }
            return userId;
        }
        catch (error) {
            return null
        }
    }
}