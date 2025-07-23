import nodemailer from "nodemailer";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, otp } = JSON.parse(event.body);

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
