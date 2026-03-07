import { useState } from "react";
import ReactQuill from "react-quill";

export default function NoteEditor() {

  const [content, setContent] = useState("");

  return (
    <div className="p-4">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        className="bg-white"
      />
    </div>
  );
}