import { useState } from "react";

export default function Home({ onSendOtp, loading, error }) {
  const [phone, setPhone] = useState("");
  const [country] = useState("+91");

  return (
    <div className="text-center space-y-6 w-full max-w-sm">
      <h1 className="text-3xl font-bold">Welcome to Skynect 🚀</h1>
      <input
        type="text"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none"
      />
      <button
        onClick={() => onSendOtp(phone, country)}
        disabled={loading || !phone}
        className="w-full px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? "Sending..." : "Connect Now!"}
      </button>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
