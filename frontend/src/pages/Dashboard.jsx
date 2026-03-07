import { useEffect, useState } from "react";
import { getNotes, createNote } from "../services/api";
import NoteEditor from "../components/NoteEditor";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await getNotes(token);
    setNotes(data);
  };

  const handleSave = async (note) => {
    await createNote(note, token);
    loadNotes();
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        My Notes
      </h1>

      <NoteEditor onSave={handleSave} />

      {notes.map((note) => (
        <div
          key={note._id}
          className="p-4 border rounded mb-3"
        >
          <h2 className="font-bold">{note.title}</h2>

          <div
            dangerouslySetInnerHTML={{
              __html: note.content,
            }}
          />
        </div>
      ))}

    </div>
  );
}