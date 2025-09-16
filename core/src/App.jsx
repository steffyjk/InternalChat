import { useState, useEffect } from "react";
import Home from "./components/Home";
import Otp from "./components/Otp";
import Chat from "./components/Chat";
import { useAuth } from "./hooks/useAuth";
import { Layout, Spin } from "antd";

const { Content } = Layout;

export default function App() {
  const { requestOtp, confirmOtp, loading, error, user, setUser } = useAuth();
  const [step, setStep] = useState("home"); // home | otp | chat
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("+91");

  // Restore from localStorage on first load
  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem("authData") || "null");
    if (authData) {
      setUser({
        id: authData.id,
        first_name: authData.first_name,
        last_name: authData.last_name,
        slug_name: authData.slug,
      });
      setStep("chat");
    }
  }, [setUser]);

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
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "16px",
        }}
      >
        {loading && step === "chat" && (
          <Spin size="large" tip="Loading chat..." />
        )}

        {step === "home" && (
          <Home onSendOtp={handleSendOtp} loading={loading} error={error} />
        )}

        {step === "otp" && (
          <Otp onVerifyOtp={handleVerifyOtp} loading={loading} error={error} />
        )}

        {step === "chat" && user && <Chat user={user} />}
      </Content>
    </Layout>
  );
}
