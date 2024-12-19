export function setUserData(user, keyNote) {
    localStorage.setItem(keyNote, JSON.stringify(user));
  }
