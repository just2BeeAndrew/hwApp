import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(userId: string) {
        const accessToken = jwt.sign({userId}, SETTINGS.ACCESS_TOKEN_SECRET, {expiresIn: "10s"});
        const refreshToken = jwt.sign({userId}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: "20s"});
        return {accessToken, refreshToken};
    },

    async verifyToken(token: string,tokenSecret: string ): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, tokenSecret) as { userId: string };
        } catch (error) {
            return null
        }
    }
}