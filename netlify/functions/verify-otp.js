// This must use the same in-memory store
import { otpStore } from './send-otp.js';

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, otp: inputOtp } = JSON.parse(event.body);
  if (!email || !inputOtp) {
    return { statusCode: 400, body: "Email and OTP are required" };
  }

  const record = otpStore[email];
  if (!record) {
    return { statusCode: 400, body: "No OTP found for this email" };
  }

  const { otp, timestamp } = record;
  const now = Date.now();

  if (now - timestamp > 5 * 60 * 1000) {
    delete otpStore[email];
    return { statusCode: 400, body: "OTP expired" };
  }

  if (String(otp) !== String(inputOtp)) {
    return { statusCode: 400, body: "Invalid OTP" };
  }

  delete otpStore[email]; // Clean up
  return { statusCode: 200, body: "OTP verified successfully" };
}
