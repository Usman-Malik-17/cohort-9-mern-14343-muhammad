import api from "../../api/axios";
import React, { useState, useEffect, useRef } from "react";
import { NotebookText, UserCircle, Plus, Download, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NoteCard from "../../components/Notes/NoteCard";

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchVal, setSearchVal] = useState("");
  const [notes, setNotes] = useState([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [notesLoadFailed, setNotesLoadFailed] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const userResponse = await api.post("/auth/current-user");
        setCurrentUser(userResponse.data.data);
      } catch (error) {
        console.error(error);
        navigate("/");
        return;
      }
      try {
        const notesResponse = await api.get("/notes/");
        setNotes(
          Array.isArray(notesResponse.data.data) ? notesResponse.data.data : [],
        );
      } catch (error) {
        setFormError("Failed to fetch notes");
        setNotesLoadFailed(true);
        console.log(error);
      }
      setPageLoading(false);
    }
    loadDashboard();
  }, []);

  async function exportNotes() {
    try {
      const notesResponse = await api.get("/notes/export");
      const notes = notesResponse.data.data;
      const jsonData = JSON.stringify(notes, null, 2);
      const blob = new Blob([jsonData], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-notes.json";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setFormError("Failed to export notes");
      console.error(error);
    }
  }

  if (!currentUser || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  function displayNotes() {
    if (searchVal.trim() !== "") {
      const query = searchVal.toLowerCase();
      return notes.filter((note) => {
        const matchesTitleOrContent = [note.title, note.content].some(
          (val) => typeof val === "string" && val.toLowerCase().includes(query),
        );
        const matchesTags =
          Array.isArray(note.tags) &&
          note.tags.some(
            (tag) =>
              typeof tag === "string" && tag.toLowerCase().includes(query),
          );
        return matchesTitleOrContent || matchesTags;
      });
    }
    return notes;
  }

  function handleFileChange(event) {
    setSuccessMessage("");
    setFormError("");
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target.result;

      try {
        const importedNotes = JSON.parse(text);

        if (!Array.isArray(importedNotes) || importedNotes.length === 0) {
          setFormError("Invalid notes file");
          return;
        }

        const isValid = importedNotes.every(
          (note) =>
            note &&
            typeof note === "object" &&
            typeof note.title === "string" &&
            note.title.trim() !== "" &&
            typeof note.content === "string" &&
            note.content.trim() !== "" &&
            Array.isArray(note.tags) &&
            note.tags.every((tag) => typeof tag === "string"),
        );

        if (!isValid) {
          setFormError("Invalid notes file");
          return;
        }

        console.log("All notes are valid:", importedNotes);

        for (const note of importedNotes) {
          await api.post("/notes/", {
            title: note.title,
            content: note.content,
            tags: note.tags,
          });
        }
        const notesResponse = await api.get("/notes/");

        setNotes(
          Array.isArray(notesResponse.data.data) ? notesResponse.data.data : [],
        );

        setFormError("");
        setSuccessMessage("Notes imported successfully");

        console.log("Notes imported successfully");
      } catch (error) {
        console.error(error);
        setFormError("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  }

  const filtered = displayNotes();

  return (
    <div>
      <nav className="relative">
        <div className="w-11/12 flex items-center justify-between mx-auto py-7">
          <Link
            to={"/dashboard"}
            className="flex gap-2 items-center hover:text-blue-600 transition-colors duration-150"
          >
            <NotebookText></NotebookText>
            <span>Notes App</span>
          </Link>
          <Link
            to={"/profile"}
            className="flex gap-2 items-center hover:text-blue-600 transition-colors duration-150"
          >
            <UserCircle
              size={24}
              className="hover:text-blue-600 transition-colors duration-150"
            />
            <span>Profile</span>
          </Link>
        </div>
        <div className="absolute w-full h-0.5 left-0 right-0 bottom-0 bg-black opacity-20"></div>
      </nav>
      <div>
        {successMessage && (
          <div className="w-full max-w-[1080px] mx-auto mt-3 px-3">
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
              {successMessage}
            </div>
          </div>
        )}

        {formError && (
          <div className="w-full max-w-[1080px] mx-auto mt-3 px-3">
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {formError}
            </div>
          </div>
        )}
        <div className="flex justify-center mt-2">
          <div className="w-full min-w-0 lg:px-6 xl:w-3/4 xl:px-12">
            <div className="relative">
              <input
                className="transition-colors duration-100 ease-in-out text-gray-600 py-2 pr-4 pl-10 block w-full appearance-none leading-normal border border-transparent rounded-lg text-left select-none truncate bg-gray-200"
                type="text"
                placeholder="Search notes..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              ></input>
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-4 flex items-center">
                <svg
                  className="fill-current pointer-events-none text-gray-600 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4 mt-2">
          <button
            type="button"
            onClick={exportNotes}
            className="underline font-semibold flex justify-center items-center gap-2 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
          >
            <Download
              size={24}
              className="hover:text-blue-600 transition-colors duration-150"
            />
            Export Note
          </button>

          <Link
            to="/notes/new"
            className="underline font-semibold flex justify-center items-center gap-1 hover:text-blue-600 transition-colors duration-150"
          >
            <Plus
              size={24}
              className="hover:text-blue-600 transition-colors duration-150"
            />
            New Note
          </Link>

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="underline font-semibold flex justify-center items-center gap-1 hover:text-blue-600 transition-colors duration-150 cursor-pointer"
          >
            <Upload size={24} />
            Import Notes
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {!notesLoadFailed && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 text-gray-400">
          <NotebookText size={48} className="mb-3" />
          <p className="text-sm">
            {searchVal.trim() !== ""
              ? "No notes match your search."
              : "You don't have any notes yet."}
          </p>
        </div>
      ) : (
        <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {filtered.map((note) => (
            <NoteCard note={note} key={note._id}></NoteCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
