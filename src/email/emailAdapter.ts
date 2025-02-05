import nodemailer from "nodemailer";
import {HttpStatuses} from "../types/httpStatuses";

export const emailAdapter = {
    async sendEmail(email: string){
        let transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "andrew.dudal.1997@gmail.com",
                pass: "bwxyzxbcfadxrmml",//bwxy zxbc fadx rmml
            },
        });

        let info = await transport.sendMail({
            from: 'just2BeeAndrew<andrew.dudal.1997@gmail.com>',
            to: email,
            subject: 'Тестовое письмо через Gmail',
            text: 'Привет, это тестовое письмо, отправленное через Nodemailer'
        });
        return info;
    },
}

