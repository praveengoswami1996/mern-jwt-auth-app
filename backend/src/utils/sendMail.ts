import createTransporter from "../config/nodemailerConfig";
import nodemailer from "nodemailer";

type Params = {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const sendMail = async ({ to, subject, text, html }: Params) => {
  const emailTransporter = await createTransporter();

  if (!emailTransporter) {
    console.error("Could not create email transporter. Aborting email send.");
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  if (!gmailUser) {
    console.error("Error: GMAIL_USER not set in .env file.");
    return;
  }

  const mailOptions = {
    from: gmailUser,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendMail;