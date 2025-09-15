import { useState } from "react";
import Home from "./components/Home";
import Otp from "./components/Otp";
import Chat from "./components/Chat";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { requestOtp, confirmOtp, loading, error, user } = useAuth();
  const [step, setStep] = useState("home"); // home | otp | chat
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("+91");

  const handleSendOtp = async (phoneNumber, countryCode) => {
    const success = await requestOtp(phoneNumber, countryCode);
    if (success) {
      setPhone(phoneNumber);
      setCountry(countryCode);
      setStep("otp");
    }
  };

  const handleVerifyOtp = async (otp) => {
    const success = await confirmOtp(otp, phone, country);
    if (success) setStep("chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {step === "home" && (
        <Home onSendOtp={handleSendOtp} loading={loading} error={error} />
      )}
      {step === "otp" && (
        <Otp onVerifyOtp={handleVerifyOtp} loading={loading} error={error} />
      )}
      {step === "chat" && user && <Chat user={user} />}
    </div>
  );
}
