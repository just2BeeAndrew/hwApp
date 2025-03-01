import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";

export const jwtService = {
    async createJWT(userId: string, deviceId: string) {
        const accessToken = await this.createAccessToken(userId);
        const refreshToken = await this.createRefreshToken(userId, deviceId);
        return { accessToken, refreshToken };
    },

    async createAccessToken(userId: string) {
        return jwt.sign({userId}, SETTINGS.ACCESS_TOKEN_SECRET, {expiresIn: "10s"});
    },

    async createRefreshToken(userId: string, deviceId: string) {
        return jwt.sign({userId, deviceId}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: "20s"});
    },

    async verifyToken(token: string, tokenSecret: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(token, tokenSecret) as { userId: string };
        } catch (error) {
            return null
        }
    }
}