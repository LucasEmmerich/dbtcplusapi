import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

const send = async (email: string, subject: string, data: Object, template_url: string) => {
  const source = readFileSync(template_url, 'utf-8').toString();
  const template = compile(source);
  const htmlToSend = template(data);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.DEV_NOREPLY_MAIL_USERNAME,
      pass: process.env.DEV_NOREPLY_MAIL_PASSWORD
    },
  });

  const mailOptions = {
    from: `
            "${process.env.DEV_NOREPLY_MAIL_USERNAME}" 
            <${process.env.DEV_NOREPLY_MAIL_USERNAME}>
          `,
    to: email,
    subject: subject,
    html: htmlToSend
  };

  const info = await transporter.sendMail(mailOptions);

  return info;
}

const sendAccountActivateEmail = async (email: string, data: { name: string, url: string }) => {
  return await send(
    email,
    'Ativação de conta | DTBC+', 
    data, 
    path.join(__dirname, './templates/account-activation.html')
  );
}

const sendForgotPasswordEmail = async () => {

}

export {
  sendAccountActivateEmail,
  sendForgotPasswordEmail
};