import { useState } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import InviteList from "./InviteList";

export default function Chat({ user }) {
  const authData = JSON.parse(localStorage.getItem("authData"));
  const token = authData?.access_token;

  const { chatList, socketConnected } = useChatSocket(user?.id, token);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState("chat"); // chat | invite

  // 🔍 Search API call
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setErrorMsg("");
      setSearchResults(null);

      const res = await fetch(
        `http://localhost:8000/auth/search/${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Search failed: ${res.status}`);
      }

      const data = await res.json();
      setSearchResults(data);
      setStep("invite"); // 👉 Go to invite page
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔙 Back to chat
  const handleBack = () => {
    setStep("chat");
    setSearchResults(null);
    setSearchTerm("");
  };

  if (step === "invite") {
    return (
      <InviteList
        searchResults={searchResults}
        onBack={handleBack}
        loading={loading}
        errorMsg={errorMsg}
      />
    );
  }

  return (
    <div className="text-center space-y-6 p-4">
      <h1 className="text-3xl font-bold">Welcome {user.first_name}!</h1>

      {/* Socket status */}
      <p
        className={`text-sm ${
          socketConnected ? "text-green-400" : "text-red-400"
        }`}
      >
        Socket status: {socketConnected ? "Connected" : "Disconnected"}
      </p>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center justify-center gap-2 max-w-md mx-auto"
      >
        <input
          type="text"
          placeholder="Search by phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
        >
          {loading ? "..." : "Search"}
        </button>
      </form>

      {/* Chat List */}
      <h2 className="text-xl mt-6">Your Chats:</h2>
      {chatList.length === 0 ? (
        <p className="text-gray-400">No chats yet.</p>
      ) : (
        <ul className="space-y-2 max-w-md mx-auto text-left">
          {chatList.map((chat) => (
            <li
              key={chat.conversation_id}
              className="border p-2 rounded bg-gray-800"
            >
              <p>
                <strong>{chat.name}</strong>
              </p>
              <p className="text-gray-400">{chat.last_message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
