import { useState } from "react";

export default function InviteList({ searchResults, onBack, loading, errorMsg }) {
  const userDetails = searchResults?.data?.user_details || {};
  const userExists = userDetails && Object.keys(userDetails).length > 0;

  const [inviteStatus, setInviteStatus] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  const handleInvite = async () => {
    const authData = JSON.parse(localStorage.getItem("authData"));
    const token = authData?.access_token;

    if (!token || !userDetails.id) {
      setInviteStatus("⚠️ Missing token or user ID");
      return;
    }

    try {
      setInviteLoading(true);
      setInviteStatus("");

      const res = await fetch("http://localhost:8000/invite/invites", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invited_user_id: userDetails.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setInviteStatus("✅ Invitation sent successfully!");
      } else {
        setInviteStatus(`❌ Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setInviteStatus(`❌ Network error: ${err.message}`);
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="p-4 text-center space-y-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
      >
        🔙 Back
      </button>

      <h2 className="text-2xl font-bold">Search Results</h2>

      {loading && <p className="text-blue-400">Searching...</p>}
      {errorMsg && <p className="text-red-400">{errorMsg}</p>}

      {searchResults && (
        <div className="mt-4 max-w-md mx-auto p-4 border rounded bg-gray-800 text-left">
          {userExists ? (
            <>
              <p>
                <strong>Name:</strong> {userDetails.first_name || "N/A"}{" "}
                {userDetails.last_name || ""}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.country_code}{" "}
                {userDetails.phone}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email || "N/A"}
              </p>
              <p>
                <strong>Slug:</strong> {userDetails.slug_name}
              </p>
              <p>
                <strong>ID:</strong> {userDetails.id}
              </p>

              <button
                onClick={handleInvite}
                disabled={inviteLoading}
                className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50"
              >
                {inviteLoading ? "Inviting..." : "✅ Invite / Start Chat"}
              </button>

              {inviteStatus && (
                <p className="mt-2 text-sm">
                  {inviteStatus.startsWith("✅") ? (
                    <span className="text-green-400">{inviteStatus}</span>
                  ) : (
                    <span className="text-red-400">{inviteStatus}</span>
                  )}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-400">❌ User does not exist</p>
          )}
        </div>
      )}
    </div>
  );
}
