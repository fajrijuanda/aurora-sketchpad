import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    secure: process.env.MAIL_ENCRYPTION === 'ssl', // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

export const sendVerificationEmail = async (to, token) => {
    const link = `http://localhost:5173/verify-email?token=${token}`;

    try {
        await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to,
            subject: 'Verify your Aurora Sketchpad Account',
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #f0f0f0;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; text-align: center;">
                        <h1 style="color: #00F0FF;">Welcome to Aurora!</h1>
                        <p>Please click the button below to verify your email address and activate your account.</p>
                        <a href="${link}" style="display: inline-block; padding: 12px 24px; background: #00F0FF; color: black; text-decoration: none; font-weight: bold; border-radius: 25px; margin-top: 20px;">Verify Email</a>
                        <p style="margin-top: 20px; color: #888; font-size: 12px;">Link expires in 24 hours.</p>
                    </div>
                </div>
            `,
        });
        console.log(`Verification email sent to ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
