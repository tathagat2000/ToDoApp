import { getDatabase, updateToDatabase } from "./database.js";
import { updatePage } from "./updatePage.js";
import { updateTodoInServerDatabase } from "./server.js";
import { showSnackbar } from "./snackbar.js";
import { addToHistory } from "./history.js";
import { queriedElements } from "./constants.js";

let currentTodoIdOpened;

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
  currentTodoIdOpened = id;
  queriedElements.updatedText.value = text;
  queriedElements.updatedUrgency.selectedIndex = indexOfUrgency(urgency);
  queriedElements.updatedCategory.selectedIndex = indexOfCategory(category);
  queriedElements.modal.style.display = "flex";
};

const closeModal = () => {
  queriedElements.modal.style.display = "none";
};

const getTodo = (id, database) => database.find((todo) => todo.id === id);

const createEvent = (type, id) => {
  return {
    operationType: type,
    todoObjectBefore: { ...getTodo(id, getDatabase()) }
  };
};

queriedElements.saveModal.addEventListener("click", (event) => {
  const updatedTextValue = queriedElements.updatedText.value;
  const updatedUrgencyValue = queriedElements.updatedUrgency.value;
  const updatedCategoryValue = queriedElements.updatedCategory.value;
  const updateEvent = createEvent("update", currentTodoIdOpened);
  const todo = getTodo(currentTodoIdOpened, getDatabase());
  const { element, ...serverCopy } = todo;
  const localCopy = { ...todo };

  serverCopy.text = updatedTextValue;
  serverCopy.urgency = updatedUrgencyValue;
  serverCopy.category = updatedCategoryValue;

  localCopy.text = updatedTextValue;
  localCopy.urgency = updatedUrgencyValue;
  localCopy.category = updatedCategoryValue;

  updateEvent.todoObjectAfter = { ...localCopy };
  updateTodoInServerDatabase(currentTodoIdOpened, serverCopy)
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
