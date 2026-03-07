import { useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  searchNotes,
  addCollaborator,
  removeCollaborator,
  deleteNote,
} from "../services/api";
import NoteEditor from "../components/NoteEditor";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [collabInputs, setCollabInputs] = useState({});
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setError("");
      const data = await getNotes(token);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load notes");
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
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
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
      const collaboratorId = collabInputs[noteId];

      if (!collaboratorId?.trim()) {
        alert("Please enter collaborator user ID");
        return;
      }

      setError("");
      await addCollaborator(noteId, collaboratorId, token);

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

  const handleResetSearch = () => {
    setSearch("");
    loadNotes();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Collab Notes</h1>
              <p className="text-gray-500 mt-1">Total Notes: {notes.length}</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded p-3 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Search notes..."
              className="border p-2 w-full rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Search
            </button>

            <button
              onClick={handleResetSearch}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
          </div>

          <NoteEditor onSave={handleSave} />
        </div>

        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
              No notes found
            </div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="bg-white p-5 rounded-xl shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {note.title}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Owner: {note.owner?.username || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {note.createdAt ? new Date(note.createdAt).toLocaleString() : ""}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(note._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>

                <div
                  className="prose max-w-none border-t pt-3"
                  dangerouslySetInnerHTML={{
                    __html: note.content || "",
                  }}
                />

                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Collaborators
                  </h3>

                  {note.collaborators && note.collaborators.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {note.collaborators.map((collab) => (
                        <div
                          key={collab._id}
                          className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2"
                        >
                          <span className="text-sm text-gray-700">
                            {collab.username}
                          </span>

                          <button
                            onClick={() => handleRemoveCollaborator(note._id, collab._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mb-3">
                      No collaborators added yet
                    </p>
                  )}

                  <input
                    type="text"
                    placeholder="Collaborator user ID"
                    value={collabInputs[note._id] || ""}
                    onChange={(e) =>
                      handleCollabInputChange(note._id, e.target.value)
                    }
                    className="border p-2 rounded w-full mb-2"
                  />

                  <button
                    onClick={() => handleAddCollaborator(note._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Add Collaborator
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}