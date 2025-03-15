import nodemailer from "nodemailer";

class EmailAdapter {
    protected transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async sendEmail(to: string, subject: string, html: string) {
        await this.transporter.sendMail({
            from: `just2BeeAndrew<${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    }
}

export const emailAdapter = new EmailAdapter();