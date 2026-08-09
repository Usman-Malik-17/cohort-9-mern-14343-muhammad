import React, { useState } from "react";
import { NotebookText, UserCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import NoteCard from "../../components/Notes/NoteCard";
import { getNotes } from "../../helpers/notesStorage";
import { getCurrentUser } from "../../helpers/profile";

function Dashboard() {
  const currentUser = getCurrentUser();
  const [searchVal, setSearchVal] = useState("");
  if (!currentUser) {
    return null;
  }
  const notes = getNotes().filter((note) => note.owner === currentUser.email);

  function displayNotes() {
    if (searchVal.trim() !== "") {
      const query = searchVal.toLowerCase();
      const notesFind = notes.filter((note) =>
        [note.title, note.content, note.tag].some(
          (val) => typeof val === "string" && val.toLowerCase().includes(query),
        ),
      );
      return notesFind;
    }
    return notes;
  }
  const filtered = displayNotes();

  return (
    <div>
      <nav className="relative">
        <div className="w-11/12 flex items-center justify-between mx-auto py-7">
          <Link
            to={"/dashboard"}
            className="flex gap-2 items-center  hover:text-blue-600 transition-colors duration-150"
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
        {/* search bar */}
        <div className="flex justify-center mt-2">
          <div className="w-full min-w-0 lg:px-6 xl:w-3/4 xl:px-12">
            <div className="relative">
              <input
                className="transition-colors duration-100 ease-in-out text-gray-600 py-2 pr-4 pl-10 block w-full appearance-none leading-normal border border-transparent rounded-lg text-left select-none truncate bg-gray-200"
                type="text"
                placeholder="Search notes..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                }}
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

        <Link
          to="/notes/new"
          className="underline font-semibold flex justify-center items-center gap-1  hover:text-blue-600 transition-colors duration-150"
        >
          <Plus
            size={24}
            className="hover:text-blue-600 transition-colors duration-150"
          />
          New Note
        </Link>
      </div>

      {/* Notes Card */}
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {filtered.map((note) => (
          <NoteCard note={note} key={note.id}></NoteCard>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
