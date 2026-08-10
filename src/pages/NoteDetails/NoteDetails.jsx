import { useParams, Link, useNavigate } from "react-router";
import { getNotes, saveNotes } from "../../helpers/notesStorage";
import { getCurrentUser } from "../../helpers/profile";
import { useEffect } from "react";

function NoteDetails() {
  const navigate = useNavigate();
  let params = useParams();
  const { id } = params;
  const notes = getNotes();
  const note = notes.find((note) => note.id === Number(id));
  const currUser = getCurrentUser();
  useEffect(() => {
    if (!note || note.owner !== currUser.email) {
      navigate("/not-found");
    }
  }, [note, currUser, navigate]);

  if (!note || note.owner !== currUser.email) {
    return null;
  }

  const deleteNote = () => {
    if (window.confirm("Delete this note?")) {
      const notes = getNotes();
      const newNotes = notes.filter((currNote) => currNote.id !== Number(id));
      saveNotes(newNotes);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Top bar */}
        <div className="p-5">
          <div className="min-h-8 w-full rounded border border-dashed border-gray-300 bg-gray-50 text-3xl font-bold text-gray-900 leading-tight flex items-center">
            {note.title}
          </div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Middle content */}
        <div className="p-5">
          <div
            className="h-auto w-full rounded border border-dashed border-gray-300 bg-gray-50 text-base text-gray-700 leading-8 whitespace-pre-wrap flex flex-col note-content"
            dangerouslySetInnerHTML={{ __html: note.content }}
          ></div>
        </div>

        <div className="border-t border-gray-200"></div>

        {/* Bottom bar */}
        <div className="p-5">
          <div className="flex justify-between items-center min-h-8 w-full rounded border border-dashed border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 flex items-center">
            {note.tag}
            <div className="flex gap-2">
              <Link
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                to={`/notes/edit/${id}`}
              >
                ✏️
              </Link>
              <button
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
                onClick={deleteNote}
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteDetails;
