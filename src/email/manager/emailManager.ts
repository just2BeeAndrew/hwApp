import {emailAdapter} from "../emailAdapter";

export const emailManagers = {
    async sendEmailRegistration(email: string, code: string) {
        await emailAdapter.sendEmail(email, code)
    }
}