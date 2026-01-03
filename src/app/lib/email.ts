import nodemailer from "nodemailer";
import {
  GMAIL,
  GOOGLE_APP_PASSWORD,
  EMAIL_SERVER_HOST,
  EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER,
  EMAIL_SERVER_PASSWORD,
  EMAIL_FROM,
  hasEmailConfig,
} from "./env";

// Create transporter based on available configuration
// Lazy-loaded to avoid initialization errors at module load time
let transporter: nodemailer.Transporter | null = null;

const getTransporter = (): nodemailer.Transporter => {
  if (transporter) {
    return transporter;
  }

  // Legacy Gmail support
  if (GMAIL && GOOGLE_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL,
        pass: GOOGLE_APP_PASSWORD,
      },
    });
    return transporter;
  }

  // Generic SMTP support
  if (EMAIL_SERVER_HOST && EMAIL_SERVER_USER && EMAIL_SERVER_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: EMAIL_SERVER_HOST,
      port: EMAIL_SERVER_PORT ? parseInt(EMAIL_SERVER_PORT, 10) : 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
      },
    });
    return transporter;
  }

  throw new Error(
    "Email configuration is missing. Please configure either Gmail or SMTP settings."
  );
};

export async function sendResetEmail(email: string, resetUrl: string) {
  try {
    if (!hasEmailConfig()) {
      throw new Error(
        "Email configuration is missing. Please check your environment variables."
      );
    }

    const emailTransporter = getTransporter();
    const fromEmail =
      EMAIL_FROM || GMAIL || EMAIL_SERVER_USER || "noreply@example.com";

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Reset Your Password</h1>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this password reset, you can safely ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
      `,
    };

    await emailTransporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}
