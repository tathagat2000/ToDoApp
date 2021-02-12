export const showSnackbar = (message) => {
  const snackbar = document.querySelector("#snackbar");
  console.log("opened");
  snackbar.innerHTML = message;
  snackbar.classList.add("show");
  setTimeout(() => {
    console.log(snackbar.className);
    snackbar.className = snackbar.className.replace("show", "");
    console.log("closed");
    console.log(snackbar.className);
  }, 3000);
};
