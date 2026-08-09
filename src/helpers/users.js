function getUsers() {
  try {
    const notes = localStorage.getItem("users");
    return notes ? JSON.parse(notes) : [];
  } catch {
    return [];
  }
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export { getUsers, setUsers };
