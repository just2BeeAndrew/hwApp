import {emailAdapter} from "../emailAdapter";

export const emailManagers = {
    async sendEmailRegistration(email: string) {
        await emailAdapter.sendEmail(email)
    }
}