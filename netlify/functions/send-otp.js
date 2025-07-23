let otpStore = {}; // TEMPORARY memory storage

import nodemailer from "nodemailer";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email } = JSON.parse(event.body);
  if (!email) {
    return { statusCode: 400, body: "Email required" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now();

  otpStore[email] = { otp, timestamp };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mindjournal08@gmail.com",
      pass: "vgkf pdyd xonp life", // App Password
    },
  });

  const mailOptions = {
    from: "MindJournal <mindjournal08@gmail.com>",
    to: email,
    subject: "Your OTP for MindJournal",
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OTP sent successfully" }),
    };
  } catch (error) {
    console.error("Send OTP error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send OTP" }),
    };
  }
}
