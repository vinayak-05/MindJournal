// netlify/functions/send-otp.js
import nodemailer from "nodemailer";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("netlify/functions/db.json");
const db = new Low(adapter);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  await db.read();
  db.data ||= { otps: [] };

  const { email } = JSON.parse(event.body);
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save OTP
  db.data.otps = db.data.otps.filter((entry) => entry.email !== email); // Remove old
  db.data.otps.push({ email, otp, createdAt: Date.now() });
  await db.write();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mindjournal08@gmail.com",
      pass: "vgkf pdyd xonp life", // App password
    },
  });

  const mailOptions = {
    from: "MindJournal <mindjournal08@gmail.com>",
    to: email,
    subject: "Your OTP for MindJournal",
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OTP sent" }),
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send OTP" }),
    };
  }
}
