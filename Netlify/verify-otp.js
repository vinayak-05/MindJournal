// netlify/functions/verify-otp.js

let otpStore = new Map(); // Warning: will reset on each function call

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, otp } = JSON.parse(event.body);
  const storedOtp = otpStore.get(email);

  if (storedOtp && parseInt(otp) === storedOtp) {
    otpStore.delete(email);
    return {
      statusCode: 200,
      body: JSON.stringify({ verified: true }),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ verified: false }),
    };
  }
}
