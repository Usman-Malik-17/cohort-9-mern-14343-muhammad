function getCurrentUser() {
  try {
    const user = localStorage.getItem("currentUser");
    if (!user) {
      return null;
    } else {
      const parsedUser = JSON.parse(user);
      if (!parsedUser.name || !parsedUser.email) {
        return null;
      } else {
        return parsedUser;
      }
    }
  } catch {
    return null;
  }
}

function setCurrentUser(currentUser) {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

export { setCurrentUser, getCurrentUser };
