import nodemailer from "nodemailer";

// Create a transporter using your SMTP provider details (e.g., Gmail, SendGrid)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or App Password
  },
});

// Function to send OTP via email
export const sendEmail = async (email: string, otp: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // Sender address
      to: email, // List of recipients
      subject: "Your OTP Code", // Subject
      text: `Your OTP is: ${otp}`, // Email body
    });

    console.log("OTP sent via email:", info.response);
  } catch (error) {
    console.error("Error sending OTP via email:", error);
    throw new Error("Failed to send OTP via email");
  }
};
