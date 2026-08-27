import api from "../api/axios";

async function getNotes(user) {
  const response = await api.get("/notes/");
  return response.data.data;
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export { saveNotes, getNotes };
