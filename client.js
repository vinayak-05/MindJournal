async function sendOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP in localStorage
  localStorage.setItem("sentOtp", otp);
  localStorage.setItem("otpExpiry", Date.now() + 5 * 60 * 1000); // 5 minutes

  const res = await fetch("/.netlify/functions/send-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  alert(data.message);
}

function verifyOtp(userInputOtp) {
  const storedOtp = localStorage.getItem("sentOtp");
  const expiry = localStorage.getItem("otpExpiry");

  if (Date.now() > expiry) {
    alert("OTP expired");
    return false;
  }

  if (userInputOtp == storedOtp) {
    alert("OTP Verified!");
    return true;
  } else {
    alert("Incorrect OTP");
    return false;
  }
}
