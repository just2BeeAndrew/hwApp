import {accountDataType} from "../types/db.types";
import {WithId} from "mongodb";
import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(userId: string) {
        const accessToken = jwt.sign({userId}, SETTINGS.ACCESS_TOKEN_SECRET, {expiresIn: "10m"});
        const refreshToken = jwt.sign({userId}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: "30d"});
        return {accessToken, refreshToken};
    },

    async verifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, SETTINGS.ACCESS_TOKEN_SECRET) as { userId: string };
        } catch (error) {
            return null
        }
    }
}