const API_URL = "http://localhost:8000/auth";

export async function sendOtp(phone_number, country_code) {
  const res = await fetch(`${API_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number, country_code }),
  });
  return res.json();
}

export async function verifyOtp(
  otp,
  otp_secret,
  phone_number,
  country_code,
  fcm_token
) {
  const res = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      otp,
      otp_secret,
      phone_number,
      country_code,
      fcm_token,
    }),
  });
  return res.json();
}
