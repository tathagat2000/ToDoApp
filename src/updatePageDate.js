const headerDate = document.querySelector("#date");

const updatePageDate = () => {
  const currentDate = new Date().toDateString();
  headerDate.innerHTML = currentDate;
};

updatePageDate();
