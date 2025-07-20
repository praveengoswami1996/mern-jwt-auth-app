import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (
      !googleClientId ||
      !googleClientSecret ||
      !googleRefreshToken ||
      !googleRedirectUri
    ) {
      console.error(
        "Error: One or more Google OAuth environment variables are missing."
      );
      return null;
    }

    const oauth2Client = new OAuth2(
      googleClientId,
      googleClientSecret,
      googleRedirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: googleRefreshToken,
    });

    let accessToken: string | null = null;
    try {
      const tokenResponse = await oauth2Client.getAccessToken();
      accessToken = tokenResponse.token || null;
    } catch (err) {
      console.error("Failed to retrieve access token:", err);
      return null;
    }

    if (!accessToken) {
      console.error("Access token could not be obtained.");
      return null;
    }

    const gmailUser = process.env.GMAIL_USER;
    if (!gmailUser) {
      console.error("Error: GMAIL_USER not set in .env file.");
      return null;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: gmailUser,
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        refreshToken: googleRefreshToken,
        accessToken: accessToken,
      },
    } as nodemailer.TransportOptions); // Type assertion for correct options structure

    return transporter;

}

export default createTransporter;