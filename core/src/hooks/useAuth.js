import { useState } from "react";
import { sendOtp, verifyOtp } from "../api/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSecret, setOtpSecret] = useState("");
  const [user, setUser] = useState(null);

  const requestOtp = async (phone_number, country_code) => {
    setLoading(true);
    setError("");
    try {
      const data = await sendOtp(phone_number, country_code);
      if (data.success) {
        // FIX: backend returns data.secret, not data[0].otp_secret
        setOtpSecret(data.data.secret);
        return true;
      }
      setError(data.message || "Failed to send OTP");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const confirmOtp = async (
    otp,
    phone_number,
    country_code,
    fcm_token = "dummy-token"
  ) => {
    setLoading(true);
    setError("");
    try {
      const data = await verifyOtp(
        otp,
        otpSecret,
        phone_number,
        country_code,
        fcm_token
      );
      if (data.success) {
        const authData = {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          id: user_details.id,
          slug: user_details.slug_name,
          first_name: user_details.first_name,
          last_name: user_details.last_name,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
        setUser(data.data.user_details); // adjust depending on verify API response
        return true;
      }
      setError(data.message || "Invalid OTP");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return { requestOtp, confirmOtp, loading, error, user };
}
