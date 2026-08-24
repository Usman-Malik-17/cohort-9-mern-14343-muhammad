// import api from "../../api/axios";
// import React, { useEffect, useState } from "react";
// import { LayoutDashboard, Save } from "lucide-react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Toolbar from "../../components/Editor/Toolbar";

// function NoteEditor() {
//   const [title, setTitle] = useState("");
//   const [tagInput, setTagInput] = useState("");
//   const [content, setContent] = useState("");
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [currentUser, setCurrentUser] = useState(null);

//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: "",
//     onUpdate: ({ editor }) => {
//       setContent(editor.getHTML());
//     },
//   });

//   useEffect(() => {
//     async function loadNoteEditor() {
//       try {
//         const userResponse = await api.post("/auth/current-user");
//         setCurrentUser(userResponse.data.data);
//       } catch (error) {
//         console.error(error);
//         navigate("/");
//         return;
//       }

//       if (id) {
//         try {
//           const response = await api.get(`/notes/${id}`);
//           const note = response.data.data;
//           setTitle(note.title);
//           setContent(note.content);
//           setTagInput(Array.isArray(note.tags) ? note.tags.join(", ") : "");
//           if (editor) {
//             editor.commands.setContent(note.content);
//           }
//         } catch (error) {
//           console.error(error);
//           navigate("/not-found");
//         }
//       }
//     }
//     loadNoteEditor();
//   }, [id, editor]);

//   if (!currentUser) {
//     return null;
//   }

//   const addNotes = async () => {
//     if (!title.trim() || !content.trim()) {
//       alert("Content and title is compulsory");
//       return;
//     }

//     const tagsArray = tagInput.trim()
//       ? tagInput
//           .split(",")
//           .map((t) => t.trim())
//           .filter(Boolean)
//       : [];

//     try {
//       if (id) {
//         await api.patch(`/notes/${id}`, { title, content, tags: tagsArray });
//       } else {
//         await api.post("/notes/", { title, content, tags: tagsArray });
//       }
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Error occurred", error);
//       alert(error.response?.data?.message || "Failed to save note");
//     }
//   };

//   return (
//     <>
//       <nav className="relative">
//         <div className="w-11/12 flex items-center justify-between mx-auto py-7">
//           <Link
//             to={"/dashboard"}
//             className="flex gap-2 items-center hover:text-blue-600 transition-colors duration-150"
//           >
//             <LayoutDashboard className="" />
//             <span>Dashboard</span>
//           </Link>
//           <button
//             onClick={addNotes}
//             className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-150"
//             type="button"
//           >
//             <Save className="" />
//             <span>Save</span>
//           </button>
//         </div>
//         <div className="absolute w-full h-0.5 left-0 right-0 bottom-0 bg-black opacity-20"></div>
//       </nav>
//       <div className="w-full max-w-[1080px] mx-auto flex items-center justify-evenly">
//         <Toolbar editor={editor}></Toolbar>
//       </div>
//       <div className="w-full max-w-[1080px] mx-auto py-3 px-3">
//         <input
//           type="text"
//           value={title}
//           placeholder="Title"
//           onChange={(e) => setTitle(e.target.value)}
//           className="text-3xl font-bold w-full outline-none mb-2 focus:ring-2 focus:ring-green-500"
//         />
//         <input
//           type="text"
//           value={tagInput}
//           placeholder="Add tags (comma separated)"
//           onChange={(e) => setTagInput(e.target.value)}
//           className="text-xs bg-gray-100 text-gray-600 w-full outline-none mb-2 focus:ring-2 focus:ring-green-500"
//         />
//         <div className="w-full min-h-[500px] focus-within:ring-2 focus-within:ring-green-500">
//           <EditorContent editor={editor} />
//         </div>
//       </div>
//     </>
//   );
// }

// export default NoteEditor;

import api from "../../api/axios";
import React, { useEffect, useState } from "react";
import { LayoutDashboard, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "../../components/Editor/Toolbar";

function NoteEditor() {
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [noteContent, setNoteContent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });
  useEffect(() => {
    async function loadNoteEditor() {
      try {
        const userResponse = await api.post("/auth/current-user");
        setCurrentUser(userResponse.data.data);
      } catch (error) {
        console.error(error);
        navigate("/");
        return;
      }
      if (id) {
        try {
          const response = await api.get(`/notes/${id}`);
          const note = response.data.data;
          setTitle(note.title);
          setContent(note.content);
          setNoteContent(note.content);
          setTagInput(Array.isArray(note.tags) ? note.tags.join(", ") : "");
        } catch (error) {
          console.error(error);
          setFormError("Failed to fetch notes");
        }
      }
      setPageLoading(false);
    }
    loadNoteEditor();
  }, [id]);

  useEffect(() => {
    if (editor && !editor.isDestroyed && noteContent !== null) {
      editor.commands.setContent(noteContent);
    }
  }, [editor, noteContent]);

  if (!currentUser || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const addNotes = async () => {
    setFormError("");
    if (!title.trim() || !content.trim()) {
      setFormError("Title and content are required.");
      return;
    }

    const tagsArray = tagInput.trim()
      ? tagInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    setSaving(true);
    try {
      if (id) {
        await api.patch(`/notes/${id}`, { title, content, tags: tagsArray });
      } else {
        await api.post("/notes/", { title, content, tags: tagsArray });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error occurred", error);
      setFormError(
        error.response?.data?.message ||
          "Failed to save note. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

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
            disabled={saving}
            className="flex gap-2 items-center cursor-pointer hover:text-blue-600 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <Save className="" />
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>
        </div>
        <div className="absolute w-full h-0.5 left-0 right-0 bottom-0 bg-black opacity-20"></div>
      </nav>

      {formError && (
        <div className="w-full max-w-[1080px] mx-auto mt-3 px-3">
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {formError}
          </div>
        </div>
      )}

      <div className="w-full max-w-[1080px] mx-auto flex items-center justify-evenly">
        <Toolbar editor={editor}></Toolbar>
      </div>
      <div className="w-full max-w-[1080px] mx-auto py-3 px-3">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold w-full outline-none mb-2 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          value={tagInput}
          placeholder="Add tags (comma separated)"
          onChange={(e) => setTagInput(e.target.value)}
          className="text-xs bg-gray-100 text-gray-600 w-full outline-none mb-2 focus:ring-2 focus:ring-green-500"
        />
        <div className="w-full min-h-[500px] focus-within:ring-2 focus-within:ring-green-500">
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}

export default NoteEditor;
