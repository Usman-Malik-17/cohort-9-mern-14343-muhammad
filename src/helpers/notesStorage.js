function getNotes() {
  try {
    const notes = localStorage.getItem("notes");
    return notes ? JSON.parse(notes) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export { saveNotes, getNotes };
