import "/src/updateHeaderDate.js";
import { createToDoElement } from "/src/toDoElement.js";
import "/src/rough.js";
import { updatePage } from "/src/updatePage.js";
import { filters } from "/src/filter.js";
import {
  addToDataBase,
  deleteFromDatabase,
  resetSelectionInDatabase,
  getDatabase,
  getCurrentToDoTextFromDatabase,
  getCurrentUrgencySelectionFromDatabase,
  getCurrentCategorySelectionFromDatabase
} from "/src/database.js";

import {
  createToDoInServerDatabase,
  deleteToDoInServerDatabase,
  bulkDeleteToDoInServerDatabase,
  bulkChangeCompletedInServerDatabase,
  updateToDoInServerDatabase
} from "/src/server.js";
import { showModal } from "/src/modal.js";
import { showSnackbar } from "/src/snackbar.js";
import { addToHistory } from "/src/history.js";
import { updateToDatabase } from "./database";

const createToDoBox = document.querySelector("#createToDo");
const toDoInput = document.querySelector("#addToDo");
const urgency = document.querySelector("#urgency");
const category = document.querySelector("#category");
const deleteSelection = document.querySelector("#deleteSelection");
const completeSelection = document.querySelector("#completeSelection");
const incompleteSelection = document.querySelector("#incompleteSelection");
const filterLogos = document.querySelector("#logos");
let toDoId = 0;

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
// DOUBT 1
//One Line Code
// const getToDo = (id, database) => {
//   return database.find((toDo) => {
//     return toDo.id === id;
//   });
// };

const getToDo = (id, database) => database.find((toDo) => toDo.id === id);

//Use Switch Case
//Make functions inside this
// DOUBT 2

const completeButtonClicked = (id) => {
  const toDo = getToDo(id, getDatabase());
  const { isSelected, element, ...serverCopy } = { ...toDo };
  const { ...localCopy } = { ...toDo };
  serverCopy.isCompleted ^= 1;
  localCopy.isCompleted ^= 1;
  updateToDoInServerDatabase(id, serverCopy)
    .then(() => {
      const event = createEvent("update", id);
      updateToDatabase(localCopy);
      event.toDoObjectAfter = { ...getToDo(id, getDatabase()) };
      updatePage(getDatabase());
      addToHistory(event);
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const selectButtonClicked = (id) => {
  const event = createEvent("update", id);
  const toDo = getToDo(id, getDatabase());
  const { ...localCopy } = { ...toDo };
  localCopy.isSelected ^= 1;
  updateToDatabase(localCopy);
  event.toDoObjectAfter = { ...getToDo(id, getDatabase()) };
  updatePage(getDatabase());
  addToHistory(event);
};

const editButtonClicked = (id) => {
  const textValue = getCurrentToDoTextFromDatabase(id);
  const urgencyValue = getCurrentUrgencySelectionFromDatabase(id);
  const categoryValue = getCurrentCategorySelectionFromDatabase(id);
  showModal(id, textValue, urgencyValue, categoryValue);
};

const createEvent = (type, id) => {
  return {
    operationType: type,
    toDoObjectBefore: { ...getToDo(id, getDatabase()) }
  };
};

const deleteButtonClicked = (id) => {
  deleteToDoInServerDatabase(id)
    .then(() => {
      const event = createEvent("delete", id);
      addToHistory(event);
      deleteFromDatabase(id);
      updatePage(getDatabase());
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const checkPathIfAnyButtonsClicked = (path) => {
  const id = getToDoId(path);
  for (const element of path) {
    const button = element.dataset?.button;
    if (button === "complete") {
      completeButtonClicked(id);
      break;
    } else if (button === "select") {
      selectButtonClicked(id);
      break;
    } else if (button === "edit") {
      editButtonClicked(id);
      break;
    } else if (button === "delete") {
      deleteButtonClicked(id);
      break;
    }
  }
};

const addEventListenersToToDo = (element) => {
  element.addEventListener("click", (event) => {
    checkPathIfAnyButtonsClicked(event.path);
  });
};

const createToDoObject = (newToDoElement) => {
  return {
    id: toDoId++,
    text: toDoInput.value,
    urgency: urgency.value,
    category: category.value,
    isSelected: false,
    isCompleted: false,
    time: getTime(),
    element: newToDoElement
  };
};
const addToDo = () => {
  const newToDoElement = createToDoElement();
  const toDoObject = createToDoObject(newToDoElement);
  const { isSelected, element, ...serverCopy } = { ...toDoObject };

  createToDoInServerDatabase(serverCopy)
    .then(() => {
      addToDataBase(toDoObject);
      updatePage(getDatabase());
      resetValues();
      addEventListenersToToDo(newToDoElement);
      const event = createEvent("create", toDoObject.id);
      addToHistory(event);
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

createToDoBox.addEventListener("keypress", (event) => {
  const key = event.keyCode || event.which || 0;
  if (key === 13 && toDoInput.value) {
    addToDo();
  }
});

const getSelectedToDo = (database) => {
  return database.filter((toDo) => {
    return toDo.isSelected;
  });
};

const deleteInBulk = () => {
  const filteredDatabase = getSelectedToDo(getDatabase());
  const listOfToDoIdsToBeDeleted = filteredDatabase.map((toDo) => toDo.id);
  bulkDeleteToDoInServerDatabase(listOfToDoIdsToBeDeleted)
    .then(() => {
      filteredDatabase.forEach((toDo) => {
        deleteFromDatabase(toDo.id);
      });
      resetSelectionInDatabase();
      updatePage(getDatabase());
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

deleteSelection.addEventListener("click", (event) => {
  deleteInBulk();
});

const markSelectionInBulk = (value) => {
  const filteredDatabase = getSelectedToDo(getDatabase());
  const listOfToDoIdsToBeChanged = filteredDatabase.map((toDo) => toDo.id);

  bulkChangeCompletedInServerDatabase(listOfToDoIdsToBeChanged, value)
    .then(() => {
      filteredDatabase.forEach((toDo) => {
        const { ...localCopy } = { ...toDo };
        localCopy.isCompleted = value;
        updateToDatabase(localCopy);
      });
      resetSelectionInDatabase();
      updatePage(getDatabase());
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

completeSelection.addEventListener("click", (event) => {
  markSelectionInBulk(1);
});

incompleteSelection.addEventListener("click", (event) => {
  markSelectionInBulk(0);
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
