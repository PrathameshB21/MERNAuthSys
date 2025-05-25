import nodeMailer from 'nodemailer';

import { configDotenv } from 'dotenv';

const transporter = nodeMailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_Login,
        pass: process.env.SMTP_Pass,
    }
});

export default transporter;
