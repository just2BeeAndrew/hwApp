import {emailAdapter} from "../emailAdapter";

export const emailManagers = {
    async sendEmail(email: string, code: string) {
        await emailAdapter.sendEmail(email, code)
    }
}