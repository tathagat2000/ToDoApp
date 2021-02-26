import { queriedElements } from "./constants.js";

export const showSnackbar = (message) => {
  const snackbar = queriedElements.snackbar;
  snackbar.innerHTML = message;
  snackbar.classList.add("show");
  setTimeout(() => {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
};
