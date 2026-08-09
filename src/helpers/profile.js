function getCurrentUser() {
  try {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : [];
  } catch {
    return [];
  }
}

function setCurrentUser(currentUser) {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
}

export { setCurrentUser, getCurrentUser };
