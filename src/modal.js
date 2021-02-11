import { getDatabase, updateDatabase } from "./database";
import { updatePage } from "./updatePage";

const modal = document.querySelector("#myModal");
const saveModal = document.querySelector("#save");
const cancelModal = document.querySelector("#cancel");
const updatedText = document.querySelector("#updatedAddToDo");
const updatedUrgency = document.querySelector("#updatedUrgency");
const updatedCategory = document.querySelector("#updatedCategory");

let currentToDoIdOpened;

const indexOfCategory = (category) => {
  const index = {
    personal: 0,
    academic: 1,
    social: 2
  };

  return index[category];
};

const indexOfUrgency = (urgency) => {
  const index = {
    low: 0,
    medium: 1,
    high: 2
  };

  return index[urgency];
};

export const showModal = (id, text, urgency, category) => {
  currentToDoIdOpened = id;
  updatedText.value = text;
  updatedUrgency.selectedIndex = indexOfUrgency(urgency);
  updatedCategory.selectedIndex = indexOfCategory(category);
  modal.style.display = "flex";
};

const closeModal = () => {
  modal.style.display = "none";
};
saveModal.addEventListener("click", (event) => {
  const updatedTextValue = updatedText.value;
  const updatedUrgencyValue = updatedUrgency.value;
  const updatedCategoryValue = updatedCategory.value;
  updateDatabase(
    currentToDoIdOpened,
    updatedTextValue,
    updatedUrgencyValue,
    updatedCategoryValue
  );

  closeModal();

  updatePage(getDatabase());
});

cancelModal.addEventListener("click", (event) => {
  closeModal();
});
