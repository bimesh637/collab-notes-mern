import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserLoggedIn(!!token);
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setUserLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    setUserLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserLoggedIn(false);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!userLoggedIn) {
    return showRegister ? (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Register onRegisterSuccess={handleRegisterSuccess} />
        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            className="text-blue-500"
            onClick={() => setShowRegister(false)}
          >
            Login
          </button>
        </p>
      </div>
    ) : (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <Login onLoginSuccess={handleLoginSuccess} />
        <p className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-500"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </p>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}