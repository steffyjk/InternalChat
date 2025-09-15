import { useState } from "react";

function App() {
  const [step, setStep] = useState("home"); // home | otp | chat
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [otp, setOtp] = useState(""); // otp input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Call send-otp API
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/auth/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Call verify-otp API
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("chat");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {/* Step 1 - Home (Enter Identifier) */}
      {step === "home" && (
        <div className="text-center space-y-6 w-full max-w-sm">
          <h1 className="text-3xl font-bold">Login to ChatApp 🚀</h1>
          <input
            type="text"
            placeholder="Enter email or phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none"
          />
          <button
            onClick={handleSendOtp}
            disabled={loading || !identifier}
            className="w-full px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </div>
      )}

      {/* Step 2 - OTP Verification */}
      {step === "otp" && (
        <div className="text-center space-y-6 w-full max-w-sm">
          <h1 className="text-3xl font-bold">Verify OTP 🔑</h1>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading || !otp}
            className="w-full px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </div>
      )}

      {/* Step 3 - Chat Room */}
      {step === "chat" && (
        <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg flex flex-col h-[80vh]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chat Room</h2>
            <button
              onClick={() => setStep("home")}
              className="text-sm text-gray-400 hover:text-red-400"
            >
              Logout
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="self-start bg-gray-700 p-3 rounded-xl max-w-xs">
              Hello! 👋
            </div>
            <div className="self-end bg-blue-600 p-3 rounded-xl max-w-xs">
              Welcome to secure chat 🎉
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700 flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none"
            />
            <button className="ml-3 px-5 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
