import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser({ username, password });

      if (res.token) {
        localStorage.setItem("token", res.token);

        if (onRegisterSuccess) {
          onRegisterSuccess();
        }
      } else {
        alert(res.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Registration error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto p-6 bg-white shadow rounded"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        Register
      </h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}