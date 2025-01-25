import bcrypt from "bcrypt";

export const bcryptService = {
    async generateHash(password: string) {
        const passwordSalt = await bcrypt.genSalt(5);
        return bcrypt.hash(password, passwordSalt);
    },
}