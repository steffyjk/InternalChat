export default function Chat({ user }) {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-3xl font-bold">🎉 Welcome {user.first_name}!</h1>
      <p className="text-gray-300">You are now inside Skynect Chat.</p>
    </div>
  );
}
