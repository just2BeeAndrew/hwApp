import bcrypt from "bcryptjs";

class BcryptService {
    async generateHash(password: string) {
        const passwordSalt = await bcrypt.genSalt(5);
        return bcrypt.hash(password, passwordSalt);
    }

    async checkPassword(password: string, passwordHash: string) {
        return bcrypt.compare(password, passwordHash);
    }
}

export const bcryptService = new BcryptService()