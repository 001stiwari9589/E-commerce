// Safe localStorage helpers to prevent crashes in private modes or VS Code embedded webviews
export const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage is not available:", e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage write blocked:", e);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage remove blocked:", e);
    }
  }
};
