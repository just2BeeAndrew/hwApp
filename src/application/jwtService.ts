import jwt from 'jsonwebtoken';
import {SETTINGS} from "../settings";
import dotenv from "dotenv";
dotenv.config();

class JwtService {
    async createJWT(userId: string, deviceId: string) {
        const accessToken = await this.createAccessToken(userId);
        const refreshToken = await this.createRefreshToken(userId, deviceId);
        return {accessToken, refreshToken};
    }

    async createAccessToken(userId: string) {
        return jwt.sign({userId}, SETTINGS.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN});//вынести в сеттинг
    }

    async createRefreshToken(userId: string, deviceId: string) {
        return jwt.sign({userId, deviceId}, SETTINGS.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN});
    }

    async verifyAccessToken(accessToken: string): Promise<{ userId: string } | null> {
        try {
            return jwt.verify(accessToken, SETTINGS.ACCESS_TOKEN_SECRET) as { userId: string };
        } catch (error) {
            return null
        }
    }

    async verifyRefreshToken(refreshToken: string): Promise<{ userId: string, deviceId: string, iat: number, exp: number } | null> {
        try {
            return jwt.verify(refreshToken, SETTINGS.REFRESH_TOKEN_SECRET) as { userId: string, deviceId: string, iat: number, exp: number };
        } catch (error) {
            return null
        }
    }

    async cutTimeFromRefreshToken(refreshToken: string): Promise<{iat: number, exp: number}> {
        try {
            return jwt.verify(refreshToken, SETTINGS.REFRESH_TOKEN_SECRET) as { iat: number, exp: number };
        } catch (error) {
            throw new Error("Invalid or Expired token")
        }
    }
}

export const jwtService = new JwtService()