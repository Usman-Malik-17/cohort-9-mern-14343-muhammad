export function getNotes() {
  try {
    const notes = localStorage.getItem("notes");
    return notes ? JSON.parse(notes) : [];
  } catch {
    return [];
  }
}
