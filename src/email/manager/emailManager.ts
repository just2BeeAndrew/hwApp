import {emailAdapter} from "../emailAdapter";

class EmailManager {
    async sendConfirmationEmail(email: string, confirmationCode: string) {
        const message = `
        <h1> Thanks for registration</h1>
        <p>to finish registration please follow the link bellow:</p>
        <a href = 'https://somesite.com/confirm-email?code=${confirmationCode}'>ЖМАК!!!</a>
        <p>complete registration></p>
        `;

        await emailAdapter.sendEmail(email,"Email confirmation", confirmationCode)
    }
}

export const emailManagers = new EmailManager()