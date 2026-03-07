import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import NoteEditor from "./components/NoteEditor"

function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <h1 className="text-2xl font-bold mb-4 text-center">
        Collab Notes
      </h1>

      <div className="flex justify-center mb-6">
        <Login />
      </div>

      <div className="mb-6">
        <Dashboard />
      </div>

      <div>
        <NoteEditor />
      </div>

    </div>
  )
}

export default App