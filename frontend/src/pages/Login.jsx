import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ username, password });

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        if (onLoginSuccess) onLoginSuccess();
      } else {
        alert(res.message || "Login failed");
      }
    } catch (err) {
      alert(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-95 transition disabled:opacity-70"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}