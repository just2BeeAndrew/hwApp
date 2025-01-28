import {UserDBType} from "../types/db.types";
import {WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(userId: string) {
        return jwt.sign({userId}, SETTINGS.JWT_SECRET, {expiresIn: "1h"});
    },

    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as { userId: string };
        } catch (error) {
            return null
        }
    }
}