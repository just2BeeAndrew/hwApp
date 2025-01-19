import {UserDBType} from "../types/db.types";
import {ObjectId, WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(user: WithId<UserDBType>) {
        const token = jwt.sign({id: user._id}, SETTINGS.JWT_SECRET, {expiresIn: "1h"});
        return token
    },

    async getUserIdByToken(token: string){
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
            return new ObjectId(result.userId);
        }
        catch (error) {
            return null
        }
    }
}