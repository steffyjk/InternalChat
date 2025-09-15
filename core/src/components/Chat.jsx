import { useChatSocket } from "../hooks/useChatSocket";

export default function Chat({ user }) {
  const authData = JSON.parse(localStorage.getItem("authData"));
  const token = authData?.access_token;

  const { chatList, socketConnected } = useChatSocket(user?.id, token);

  return (
    <div className="text-center space-y-6 p-4">
      <h1 className="text-3xl font-bold">🎉 Welcome {user.first_name}!</h1>
      <p className="text-gray-300">
        You are now inside Skynect Chat.
      </p>

      <p className={`text-sm ${socketConnected ? "text-green-400" : "text-red-400"}`}>
        Socket status: {socketConnected ? "Connected" : "Disconnected"}
      </p>

      <h2 className="text-xl mt-6">Your Chats:</h2>
      {chatList.length === 0 ? (
        <p className="text-gray-400">No chats yet.</p>
      ) : (
        <ul className="space-y-2 max-w-md mx-auto text-left">
          {chatList.map((chat) => (
            <li key={chat.conversation_id} className="border p-2 rounded bg-gray-800">
              <p><strong>{chat.name}</strong></p>
              <p className="text-gray-400">{chat.last_message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
