import { useState } from "react";

export default function Otp({ onVerifyOtp, loading, error }) {
  const [otp, setOtp] = useState("");

  return (
    <div className="text-center space-y-6 w-full max-w-sm">
      <h1 className="text-2xl font-semibold">Enter OTP 🔑</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none"
      />
      <button
        onClick={() => onVerifyOtp(otp)}
        disabled={loading || !otp}
        className="w-full px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
