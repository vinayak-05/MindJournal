// // netlify/functions/verify-otp.js
// import { Low } from "lowdb";
// import { JSONFile } from "lowdb/node";

// const adapter = new JSONFile("netlify/functions/db.json");
// const db = new Low(adapter);

// export async function handler(event) {
//   if (event.httpMethod !== "POST") {
//     return { statusCode: 405, body: "Method Not Allowed" };
//   }

//   await db.read();
//   db.data ||= { otps: [] };

//   const { email, otp } = JSON.parse(event.body);
//   const record = db.data.otps.find((entry) => entry.email === email);

//   if (record && parseInt(otp) === record.otp) {
//     const now = Date.now();
//     const isExpired = now - record.createdAt > 5 * 60 * 1000;

//     if (isExpired) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ verified: false, message: "OTP expired" }),
//       };
//     }

//     db.data.otps = db.data.otps.filter((entry) => entry.email !== email); // Cleanup
//     await db.write();

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ verified: true }),
//     };
//   } else {
//     return {
//       statusCode: 400,
//       body: JSON.stringify({ verified: false, message: "Invalid OTP" }),
//     };
//   }
// }
