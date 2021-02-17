import { getDatabase, updateToDatabase } from "./database";
import { updatePage } from "./updatePage";
import { updateToDoInServerDatabase } from "/src/server.js";
import { showSnackbar } from "/src/snackbar.js";
import { addToHistory } from "/src/history.js";
import { queriedElements } from "/src/constants.js";

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
  queriedElements.updatedText.value = text;
  queriedElements.updatedUrgency.selectedIndex = indexOfUrgency(urgency);
  queriedElements.updatedCategory.selectedIndex = indexOfCategory(category);
  queriedElements.modal.style.display = "flex";
};

const closeModal = () => {
  queriedElements.modal.style.display = "none";
};

const getToDo = (id, database) => database.find((toDo) => toDo.id === id);

const createEvent = (type, id) => {
  return {
    operationType: type,
    toDoObjectBefore: { ...getToDo(id, getDatabase()) }
  };
};

queriedElements.saveModal.addEventListener("click", (event) => {
  const updatedTextValue = queriedElements.updatedText.value;
  const updatedUrgencyValue = queriedElements.updatedUrgency.value;
  const updatedCategoryValue = queriedElements.updatedCategory.value;
  const updateEvent = createEvent("update", currentToDoIdOpened);
  const toDo = getToDo(currentToDoIdOpened, getDatabase());
  const { element, ...serverCopy } = toDo;
  const localCopy = { ...toDo };

  serverCopy.text = updatedTextValue;
  serverCopy.urgency = updatedUrgencyValue;
  serverCopy.category = updatedCategoryValue;

  localCopy.text = updatedTextValue;
  localCopy.urgency = updatedUrgencyValue;
  localCopy.category = updatedCategoryValue;

  updateEvent.toDoObjectAfter = { ...localCopy };
  updateToDoInServerDatabase(currentToDoIdOpened, serverCopy)
    .then(() => {
      updateToDatabase(localCopy);
      closeModal();
      updatePage(getDatabase());
      addToHistory(updateEvent);
    })
    .catch((err) => {
      showSnackbar(err);
    });
});

queriedElements.cancelModal.addEventListener("click", (event) => {
  closeModal();
});
