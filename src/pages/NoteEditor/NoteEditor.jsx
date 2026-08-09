import React, { useEffect, useState } from "react";
import { LayoutDashboard, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getNotes, saveNotes } from "../../helpers/notesStorage";
import { getCurrentUser } from "../../helpers/profile";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "../../components/Editor/Toolbar";

function NoteEditor() {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getCurrentUser();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const addNotes = () => {
    if (!title.trim() || !content.trim()) {
      alert("Content and title is compulsory");
      return;
    }
    const note = {
      id: id ? Number(id) : Date.now(),
      title,
      tag,
      content,
      owner: currentUser.email,
    };
    const tempNotes = getNotes();
    const notes = id
      ? tempNotes.filter((currNotes) => currNotes.id !== Number(id))
      : tempNotes;
    notes.push(note);
    saveNotes(notes);
    navigate("/dashboard");
  };

  useEffect(() => {
    const notes = getNotes();
    if (id) {
      const note = notes.find((note) => note.id === Number(id));
      if (note) {
        if (note.owner !== currentUser.email) {
          navigate("/not-found");
        } else {
          setTitle(note.title);
          setContent(note.content);
          setTag(note.tag);
          if (editor) {
            editor.commands.setContent(note.content);
          }
        }
      } else {
        navigate("/not-found");
      }
    }
  }, [id, navigate, editor]);

  return (
    <>
      <nav className="relative">
        <div className="w-11/12 flex items-center justify-between mx-auto py-7">
          <Link
            to={"/dashboard"}
            className="flex gap-2 items-center hover:text-blue-600 transition-colors duration-150"
          >
            <LayoutDashboard className="" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={addNotes}
            className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-150"
            type="button"
          >
            <Save className="" />
            <span>Save</span>
          </button>
        </div>
        <div className="absolute w-full h-0.5 left-0 right-0 bottom-0 bg-black opacity-20"></div>
      </nav>
      {/* rich text Editor */}
      <div className="w-full max-w-[1080px] mx-auto flex items-center justify-evenly">
        <Toolbar editor={editor}></Toolbar>
      </div>

      {/* for making notes */}
      <div className="w-full max-w-[1080px] mx-auto py-3 px-3">
        {/* For Title */}
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold w-full outline-none mb-2 focus:ring-2 focus:ring-green-500"
        />
        {/* For Tag */}
        <input
          type="text"
          value={tag}
          placeholder="Add a tag"
          onChange={(e) => setTag(e.target.value)}
          className="text-xs bg-gray-100 text-gray-600 w-full outline-none mb-2 focus:ring-2 focus:ring-green-500"
        />
        {/* Editor */}
        <div className="w-full min-h-[500px] focus-within:ring-2 focus-within:ring-green-500">
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}

export default NoteEditor;
