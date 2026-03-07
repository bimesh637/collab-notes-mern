import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register({ onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  const { fullName, age, email, username, password } = formData;

  if (!fullName || !age || !email || !username || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await registerUser(formData);

    if (res.message || res.success || res.user) {
      alert("Registration successful! Please login.");

      // go to login page
      if (onRegisterSuccess) {
        onRegisterSuccess(false);
      }
    } else {
      alert(res.message || "Registration failed");
    }

  } catch (err) {
    alert(err.message || "Registration error");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:opacity-95 transition disabled:opacity-70"
      >
        {loading ? "Registering..." : "Create Account"}
      </button>
    </form>
  );
}