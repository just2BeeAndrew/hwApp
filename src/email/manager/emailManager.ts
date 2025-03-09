import {emailAdapter} from "../emailAdapter";

class EmailManager {
    async sendEmail(email: string, code: string) {
        await emailAdapter.sendEmail(email, code)
    }
}

export const emailManagers = new EmailManager()