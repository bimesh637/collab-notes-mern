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

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        if (onRegisterSuccess) onRegisterSuccess();
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
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create Account
      </h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}