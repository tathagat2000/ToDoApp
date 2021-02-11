import "/src/updateHeaderDate.js";
import { createToDoElement } from "/src/toDoElement.js";
import "/src/rough.js";
import { updatePage } from "/src/updatePage.js";
import { filters } from "/src/filter.js";
import {
  addToDataBase,
  deleteFromDatabase,
  resetSelectionInDatabase,
  changeCompletedInDatabase,
  toggleCompleteInDatabase,
  toggleSelectInDatabase,
  getDatabase,
  getCurrentToDoTextFromDatabase,
  getCurrentUrgencySelectionFromDatabase,
  getCurrentCategorySelectionFromDatabase
} from "/src/database.js";

import { showModal } from "/src/modal.js";

const createToDoBox = document.querySelector("#createToDo");
const toDoInput = document.querySelector("#addToDo");
const urgency = document.querySelector("#urgency");
const category = document.querySelector("#category");
const deleteSelection = document.querySelector("#deleteSelection");
const completeSelection = document.querySelector("#completeSelection");
const incompleteSelection = document.querySelector("#incompleteSelection");
const filterLogos = document.querySelector("#logos");

const getTime = () => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  return date + ", " + time;
};

const resetValues = () => {
  toDoInput.value = "";
  urgency.selectedIndex = 0;
  category.selectedIndex = 0;
};

const getToDoId = (path) => {
  for (const element of path) {
    if (element.classList?.contains("toDo")) {
      return Number(element.id);
    }
  }
};

const checkPathIfAnyButtonsClicked = (path) => {
  const id = getToDoId(path);
  for (const element of path) {
    if (element.id === "completeButton") {
      toggleCompleteInDatabase(id);
      updatePage(getDatabase());
      break;
    } else if (element.id === "select") {
      toggleSelectInDatabase(id);
      updatePage(getDatabase());
      break;
    } else if (element.id === "editButton") {
      const textValue = getCurrentToDoTextFromDatabase(id);
      const urgencyValue = getCurrentUrgencySelectionFromDatabase(id);
      const categoryValue = getCurrentCategorySelectionFromDatabase(id);
      showModal(id, textValue, urgencyValue, categoryValue);
      break;
    } else if (element.id === "deleteButton") {
      deleteFromDatabase(id);
      updatePage(getDatabase());
      break;
    }
  }
};

const addEventListenersToToDo = (element) => {
  element.addEventListener("click", (event) => {
    checkPathIfAnyButtonsClicked(event.path);
  });
};

createToDoBox.addEventListener("keypress", (event) => {
  const key = event.keyCode || event.which || 0;
  if (key === 13 && toDoInput.value) {
    const currentTime = getTime();
    const newToDoElement = createToDoElement();
    addToDataBase(newToDoElement, currentTime);
    updatePage(getDatabase());
    resetValues();
    addEventListenersToToDo(newToDoElement);
  }
});

const getSelectedToDo = (database) => {
  return database.filter((toDo) => {
    return toDo.isSelected;
  });
};

deleteSelection.addEventListener("click", (event) => {
  const filteredDatabase = getSelectedToDo(getDatabase());
  filteredDatabase.forEach((toDo) => {
    deleteFromDatabase(toDo.id);
  });
  resetSelectionInDatabase();
  updatePage(getDatabase());
});

completeSelection.addEventListener("click", (event) => {
  const filteredDatabase = getSelectedToDo(getDatabase());
  filteredDatabase.forEach((toDo) => {
    changeCompletedInDatabase(toDo.id, 1);
  });
  resetSelectionInDatabase();
  updatePage(getDatabase());
});

incompleteSelection.addEventListener("click", (event) => {
  const filteredDatabase = getSelectedToDo(getDatabase());
  filteredDatabase.forEach((toDo) => {
    changeCompletedInDatabase(toDo.id, 0);
  });
  resetSelectionInDatabase();
  updatePage(getDatabase());
});

const changeLogoStyle = (element) => {
  if (filters[element.id]) {
    element.style.fontSize = "2vw";
  } else {
    element.style.fontSize = "1.2vw";
  }
};

filterLogos.addEventListener("click", (event) => {
  const element = event.path.find((element) => {
    return element.tagName === "BUTTON";
  });

  if (element) {
    filters[element.id] ^= 1;
    changeLogoStyle(element);
  }

  updatePage(getDatabase());
});
