import { useEffect, useMemo, useState } from "react";
import {
  getNotes,
  createNote,
  searchNotes,
  addCollaborator,
  removeCollaborator,
  deleteNote,
} from "../services/api";
import NoteEditor from "../components/NoteEditor";
import Loader from "../components/Loader";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [collabInputs, setCollabInputs] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await getNotes(token);
    setNotes(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(err.message || "Failed to load notes");
  } finally {
    setLoading(false);
  }
};

  const handleSearch = async () => {
    try {
      setError("");

      if (!search.trim()) {
        loadNotes();
        
        return;
      }

      const data = await searchNotes(search, token);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Search failed");
    }
  };

  const handleResetSearch = () => {
    setSearch("");
    loadNotes();
  };

  const handleSave = async (noteData) => {
    try {
      setError("");
      await createNote(noteData, token);
      loadNotes();
    } catch (err) {
      setError(err.message || "Failed to save note");
    }
  };

  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;

    try {
      setError("");
      await deleteNote(noteId, token);
      loadNotes();
    } catch (err) {
      setError(err.message || "Failed to delete note");
    }
  };

  const handleCollabInputChange = (noteId, value) => {
    setCollabInputs((prev) => ({
      ...prev,
      [noteId]: value,
    }));
  };

  const handleAddCollaborator = async (noteId) => {
    try {
      const username = collabInputs[noteId];

      if (!username?.trim()) {
        alert("Please enter collaborator username");
        return;
      }

      setError("");
      await addCollaborator(noteId, username, token);

      setCollabInputs((prev) => ({
        ...prev,
        [noteId]: "",
      }));

      loadNotes();
    } catch (err) {
      setError(err.message || "Failed to add collaborator");
    }
  };

  const handleRemoveCollaborator = async (noteId, collaboratorId) => {
    try {
      setError("");
      await removeCollaborator(noteId, collaboratorId, token);
      loadNotes();
    } catch (err) {
      setError(err.message || "Failed to remove collaborator");
    }
  };

  const handleLogout = () => {

  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) {
    return; // user clicked No
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // go to login page
  window.location.reload();
};

  const myNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.owner &&
        currentUser &&
        (note.owner.username === currentUser.username ||
          note.owner.userId === currentUser.userId)
    );
  }, [notes, currentUser]);

  const sharedNotes = useMemo(() => {
    return notes.filter(
      (note) =>
        note.owner &&
        currentUser &&
        !(
          note.owner.username === currentUser.username ||
          note.owner.userId === currentUser.userId
        )
    );
  }, [notes, currentUser]);

  const stats = [
    {
      label: "Total Notes",
      value: notes.length,
    },
    {
      label: "My Notes",
      value: myNotes.length,
    },
    {
      label: "Shared With Me",
      value: sharedNotes.length,
    },
  ];
  if (loading) {
  return <Loader />;
}

  const renderNoteCard = (note, isOwner) => (
    <div
      key={note._id}
      className="group rounded-3xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl font-bold text-slate-800">
                {note.title}
              </h3>

              <span className="rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1">
                {isOwner ? "Owner Note" : "Shared Note"}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              <p>
                <span className="font-medium text-slate-600">Owner:</span>{" "}
                {note.owner?.username || "Unknown"}
              </p>
              <p>
                <span className="font-medium text-slate-600">
                  Collaborators:
                </span>{" "}
                {note.collaborators?.length || 0}
              </p>
              <p>
                {note.createdAt
                  ? new Date(note.createdAt).toLocaleString()
                  : ""}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={() => handleDelete(note._id)}
              className="rounded-2xl bg-red-500 hover:bg-red-600 text-white px-4 py-2 font-medium shadow-sm transition"
            >
              Delete
            </button>
          )}
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{
              __html: note.content || "",
            }}
          />
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-slate-800">
              Collaborators
            </h4>
            <span className="rounded-full bg-slate-100 text-slate-600 text-xs px-3 py-1">
              {note.collaborators?.length || 0} member(s)
            </span>
          </div>

          {note.collaborators && note.collaborators.length > 0 ? (
            <div className="space-y-2 mb-4">
              {note.collaborators.map((collab) => (
                <div
                  key={collab._id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-700">
                      {collab.fullName || collab.username}
                    </p>
                    <p className="text-sm text-slate-500">@{collab.username}</p>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() =>
                        handleRemoveCollaborator(note._id, collab._id)
                      }
                      className="rounded-xl bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-sm font-medium transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500 mb-4">
              No collaborators added yet
            </div>
          )}

          {isOwner && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700 mb-3">
                Add a collaborator by username
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter collaborator username"
                  value={collabInputs[note._id] || ""}
                  onChange={(e) =>
                    handleCollabInputChange(note._id, e.target.value)
                  }
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                />

                <button
                  onClick={() => handleAddCollaborator(note._id)}
                  className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 font-semibold shadow-sm hover:opacity-95 transition"
                >
                  Add Collaborator
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.10),_transparent_28%)]" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:py-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200 mb-4">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Collaborative Workspace
              </p>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Collab Notes
              </h1>

              <p className="text-slate-300 mt-3 text-lg">
                Welcome back,{" "}
                <span className="font-semibold text-white">
                  {currentUser?.fullName || currentUser?.username || "User"}
                </span>
              </p>

              <div className="mt-4 space-y-1 text-sm text-slate-300">
                <p>
                  {currentUser?.userId ? `User ID: ${currentUser.userId}` : ""}
                  {currentUser?.email ? ` | Email: ${currentUser.email}` : ""}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="self-start lg:self-auto rounded-2xl bg-red-500 hover:bg-red-600 text-white px-5 py-3 font-semibold shadow-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-8">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_1.8fr]">
          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Search Notes
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Find notes instantly using full-text search
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Search by title or content..."
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSearch}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-3 font-semibold shadow-sm hover:opacity-95 transition"
                  >
                    Search
                  </button>

                  <button
                    onClick={handleResetSearch}
                    className="rounded-2xl bg-slate-700 hover:bg-slate-800 text-white px-5 py-3 font-semibold transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-6">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-800">
                  Create a New Note
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Write and organize your ideas with rich text support
                </p>
              </div>

              <NoteEditor onSave={handleSave} />
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">My Notes</h2>
                <span className="rounded-full bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1">
                  {myNotes.length}
                </span>
              </div>

              <div className="space-y-5">
                {myNotes.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-dashed border-slate-200 p-10 text-center text-slate-500 shadow-sm">
                    No personal notes found
                  </div>
                ) : (
                  myNotes.map((note) => renderNoteCard(note, true))
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  Shared With Me
                </h2>
                <span className="rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium px-3 py-1">
                  {sharedNotes.length}
                </span>
              </div>

              <div className="space-y-5">
                {sharedNotes.length === 0 ? (
                  <div className="rounded-3xl bg-white border border-dashed border-slate-200 p-10 text-center text-slate-500 shadow-sm">
                    No shared notes found
                  </div>
                ) : (
                  sharedNotes.map((note) => renderNoteCard(note, false))
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16">
  <div className="max-w-7xl mx-auto px-4 md:px-8">
    
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm py-6 text-center text-slate-500 text-sm">
      
      <p className="font-semibold text-slate-700">
        Collab Notes — MERN Stack Collaborative Note App
      </p>

      <p className="mt-1">
        Built with React, Node.js, MongoDB, Express & Tailwind CSS
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Internship Project © {new Date().getFullYear()}
      </p>

    </div>

  </div>
</footer>
      </div>
    </div>
  );
}