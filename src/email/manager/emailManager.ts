import {emailAdapter} from "../emailAdapter";

class EmailManager {
    async sendConfirmationEmail(email: string, confirmationCode: string) {
        const message = `
        <h1> Thanks for registration</h1>
        <p>to finish registration please follow the link bellow:</p>
        <a href = 'https://somesite.com/confirm-email?code=${confirmationCode}'>ЖМАК!!!</a>
        <p>complete registration></p>
        `;

        await emailAdapter.sendEmail(email,"Email confirmation", message)
    }

    async sendPasswordRecoveryEmail(email: string, recoveryCode: string) {
        const message = `
        <h1> Password recovery</h1>
        <p>to reset your password please follow the link bellow:</p>
        <a href = 'https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>ЖМАК!!!</a>
        <p>complete recovery></p>
        `;

        await emailAdapter.sendEmail(email, "Password recovery", message)
    }
}

export const emailManagers = new EmailManager()