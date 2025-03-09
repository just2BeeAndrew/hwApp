import nodemailer from "nodemailer";

class EmailManager {
    async sendEmail(email: string, code: string) {
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "andrew.dudal.1997@gmail.com",
                pass: "bwxyzxbcfadxrmml",//bwxy zxbc fadx rmml
            },
        });

        return await transport.sendMail({
            from: 'just2BeeAndrew<andrew.dudal.1997@gmail.com>',
            to: email,
            subject: 'Тестовое письмо через Gmail',
            html: `<h1> Thanks for registration</h1><p>to finish registration please follow the link bellow:<a href = 'https://somesite.com/confirm-email?code=${code}'>ЖМАК!!!</a>complete registration></p>`
        });
    }
}

export const emailAdapter = new EmailManager()

