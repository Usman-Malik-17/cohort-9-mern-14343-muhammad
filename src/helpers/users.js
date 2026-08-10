function getUsers() {
  try {
    const users = localStorage.getItem("users");
    if (!users) {
      return [];
    }
    const parsedUsers = JSON.parse(users);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export { getUsers, setUsers };
