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
    setUserLoggedIn(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  if (!userLoggedIn) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
            <div className="hidden lg:block text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur mb-6">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-sm text-slate-200">Internship Project Demo</span>
              </div>

              <h1 className="text-5xl font-bold leading-tight mb-6">
                Collaborate on notes with a clean,
                <span className="text-cyan-400"> modern workspace</span>
              </h1>

              <p className="text-slate-300 text-lg leading-8 max-w-xl mb-8">
                Secure note-taking with JWT authentication, full-text search,
                collaborator management, rich text editing, and a responsive UI
                built with the MERN stack and Tailwind CSS.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                  <h3 className="text-lg font-semibold mb-2">Secure Access</h3>
                  <p className="text-slate-300 text-sm">
                    JWT-based authentication for protected note access.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                  <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
                  <p className="text-slate-300 text-sm">
                    Quickly find notes with full-text search across content.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                  <h3 className="text-lg font-semibold mb-2">Team Sharing</h3>
                  <p className="text-slate-300 text-sm">
                    Add collaborators and manage shared note access.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                  <h3 className="text-lg font-semibold mb-2">Rich Editing</h3>
                  <p className="text-slate-300 text-sm">
                    Create readable, structured notes in a polished editor.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto">
              <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    C
                  </div>
                  <h2 className="text-3xl font-bold text-white">Collab Notes</h2>
                  <p className="text-slate-300 mt-2">
                    {showRegister
                      ? "Create your account to start collaborating"
                      : "Sign in to access your workspace"}
                  </p>
                </div>

                {showRegister ? (
                  <>
                    <Register onRegisterSuccess={() => setShowRegister(false)} />
                    <p className="text-center mt-6 text-sm text-slate-300">
                      Already have an account?{" "}
                      <button
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                        onClick={() => setShowRegister(false)}
                      >
                        Login
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <Login onLoginSuccess={handleLoginSuccess} />
                    <p className="text-center mt-6 text-sm text-slate-300">
                      Don&apos;t have an account?{" "}
                      <button
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                        onClick={() => setShowRegister(true)}
                      >
                        Register
                      </button>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}