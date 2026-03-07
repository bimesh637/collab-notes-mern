import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function NoteEditor({ onSave }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      title,
      content,
    });

    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">

      <input
        type="text"
        placeholder="Note title"
        className="w-full border p-2 mb-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 mt-3 rounded"
      >
        Save Note
      </button>

    </form>
  );
}