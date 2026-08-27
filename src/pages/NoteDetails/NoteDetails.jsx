import DOMPurify from "dompurify";
import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function NoteDetails() {
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function loadNoteDetails() {
      try {
        const userResponse = await api.post("/auth/current-user");
        setCurrentUser(userResponse.data.data);
      } catch (error) {
        console.error(error);
        navigate("/");
        return;
      }

      try {
        const userNote = await api.get(`/notes/${id}`);
        const note = userNote.data.data;
        setTitle(note.title);
        setContent(note.content);
        setTagInput(Array.isArray(note.tags) ? note.tags.join(", ") : "");
      } catch (error) {
        console.error(error);
        navigate("/not-found");
        return;
      }

      setPageLoading(false);
    }
    loadNoteDetails();
  }, [id]);

  if (!currentUser || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const deleteNote = async () => {
    if (!window.confirm("Delete this note?")) {
      return;
    }
    setDeleteError("");
    try {
      await api.delete(`/notes/${id}`);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete note. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5">
          <div className="min-h-8 w-full rounded border border-dashed border-gray-300 bg-gray-50 text-3xl font-bold text-gray-900 leading-tight flex items-center">
            {title}
          </div>
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="p-5">
          <div
            className="h-auto w-full rounded border border-dashed border-gray-300 bg-gray-50 text-base text-gray-700 leading-8 whitespace-pre-wrap flex flex-col note-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          ></div>
        </div>
        <div className="border-t border-gray-200"></div>

        {deleteError && (
          <div className="px-5">
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {deleteError}
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="flex justify-between items-center min-h-8 w-full rounded border border-dashed border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 flex items-center">
            {tagInput}
            <div className="flex gap-2">
              <Link
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50 cursor-pointer"
                to={`/notes/edit/${id}`}
              >
                ✏️
              </Link>
              <button
                type="button"
                className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 cursor-pointer"
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
