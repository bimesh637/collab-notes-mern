import { useEffect, useState } from "react";
import { getNotes } from "../services/api";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    getNotes(token).then((data) => {
      setNotes(data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        My Notes
      </h1>

      {notes.map((note) => (
        <div
          key={note._id}
          className="p-4 border rounded mb-3"
        >
          {note.title}
        </div>
      ))}
    </div>
  );
}