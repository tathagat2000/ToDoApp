import "/src/updateHeaderDate.js";
import {
  createToDoInServerDatabase,
  deleteToDoInServerDatabase,
  bulkDeleteToDoInServerDatabase,
  bulkUpdateToDoInServerDatabase,
  updateToDoInServerDatabase,
  getServerDatabase
} from "/src/server.js";
import { createToDoElement } from "/src/toDoElement.js";
import { updatePage } from "/src/updatePage.js";
import { filters } from "/src/filter.js";
import {
  addToDataBase,
  deleteFromDatabase,
  resetSelection,
  getDatabase,
  getCurrentToDoData,
  selectedList
} from "/src/database.js";

import { showModal } from "/src/modal.js";
import { showSnackbar } from "/src/snackbar.js";
import { addToHistory } from "/src/history.js";
import { updateToDatabase } from "./database";
import { queriedElements, dataConstants } from "./constants";

let toDoId = 0;

const getTime = () => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  return date + ", " + time;
};

const resetValues = () => {
  queriedElements.toDoInput.value = "";
  queriedElements.urgency.selectedIndex = 0;
  queriedElements.category.selectedIndex = 0;
};

const getToDoId = (path) => {
  for (const element of path) {
    if (element.classList?.contains("toDo")) {
      return Number(element.id);
    }
  }
};

const getToDo = (id, database) => database.find((toDo) => toDo.id === id);

const completeButtonClicked = (id) => {
  const toDo = getToDo(id, getDatabase());
  const { element, ...serverCopy } = toDo;
  const localCopy = { ...toDo };
  serverCopy.isCompleted = !serverCopy.isCompleted;
  localCopy.isCompleted = !localCopy.isCompleted;
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
  if (selectedList.includes(id)) {
    selectedList.splice(selectedList.indexOf(id), 1);
  } else {
    selectedList.push(id);
  }

  updatePage(getDatabase());
};

const editButtonClicked = (id) => {
  const textValue = getCurrentToDoData(id, "text");
  const urgencyValue = getCurrentToDoData(id, "urgency");
  const categoryValue = getCurrentToDoData(id, "category");
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
  const allButtons = [
    dataConstants.COMPLETEBUTTON,
    dataConstants.SELECTBUTTON,
    dataConstants.EDITBUTTON,
    dataConstants.DELETEBUTTON
  ];
  const button = path.find((element) => {
    return allButtons.includes(element.dataset?.button);
  });

  switch (button?.dataset?.button) {
    case dataConstants.COMPLETEBUTTON:
      completeButtonClicked(id);
      break;

    case dataConstants.SELECTBUTTON:
      selectButtonClicked(id);
      break;

    case dataConstants.EDITBUTTON:
      editButtonClicked(id);
      break;

    case dataConstants.DELETEBUTTON:
      deleteButtonClicked(id);
      break;

    default:
      break;
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
    text: queriedElements.toDoInput.value,
    urgency: queriedElements.urgency.value,
    category: queriedElements.category.value,
    isCompleted: false,
    time: getTime(),
    element: newToDoElement
  };
};

const addToDo = () => {
  const newToDoElement = createToDoElement();
  const toDoObject = createToDoObject(newToDoElement);
  const { element, ...serverCopy } = toDoObject;

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
      console.log(err);
      showSnackbar(err);
    });
};

queriedElements.createToDoBox.addEventListener("keypress", (event) => {
  const key = event.keyCode || event.which || 0;
  if (key === 13 && queriedElements.toDoInput.value) {
    addToDo();
  }
});

const deleteInBulk = () => {
  const listOfToDoIdsToBeDeleted = selectedList;
  const event = {
    operationType: "bulkDelete"
  };
  const listOfToDoObjects = listOfToDoIdsToBeDeleted.map((id) => {
    return { ...getToDo(id, getDatabase()) };
  });
  event.toDoObjectList = listOfToDoObjects;
  bulkDeleteToDoInServerDatabase(listOfToDoIdsToBeDeleted)
    .then(() => {
      listOfToDoIdsToBeDeleted.forEach((id) => {
        deleteFromDatabase(id);
      });
      resetSelection();
      updatePage(getDatabase());
      addToHistory(event);
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

queriedElements.deleteSelection.addEventListener("click", (event) => {
  deleteInBulk();
});

const createBulkUpdateEvent = (listOfToDosToBeChanged, value) => {
  const event = {
    operationType: "bulkUpdate"
  };

  event.toDoObjectListBefore = listOfToDosToBeChanged.map((toDo) => {
    return { ...toDo };
  });

  event.toDoObjectListAfter = listOfToDosToBeChanged.map((toDo) => {
    const copy = { ...toDo };
    copy.isCompleted = value;
    return copy;
  });

  return event;
};

const markSelectionInBulk = (value) => {
  const listOfToDosToBeChanged = selectedList.map((id) =>
    getToDo(id, getDatabase())
  );

  const event = createBulkUpdateEvent(listOfToDosToBeChanged, value);

  const serverCopyOfListOfToDos = listOfToDosToBeChanged.map((toDo) => {
    const { element, ...serverCopy } = toDo;
    serverCopy.isCompleted = value;
    return serverCopy;
  });

  bulkUpdateToDoInServerDatabase(serverCopyOfListOfToDos)
    .then(() => {
      listOfToDosToBeChanged.forEach((toDo) => {
        const localCopy = { ...toDo };
        localCopy.isCompleted = value;
        updateToDatabase(localCopy);
      });
      resetSelection();
      updatePage(getDatabase());
      addToHistory(event);
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

queriedElements.completeSelection.addEventListener("click", (event) => {
  markSelectionInBulk(1);
});

queriedElements.incompleteSelection.addEventListener("click", (event) => {
  markSelectionInBulk(0);
});

const changeLogoStyle = (element) => {
  if (filters[element.id]) {
    element.style.fontSize = "2vw";
  } else {
    element.style.fontSize = "1.2vw";
  }
};

queriedElements.filterLogos.addEventListener("click", (event) => {
  const element = event.path.find((element) => {
    return element.tagName === "BUTTON";
  });

  if (element) {
    filters[element.id] = !filters[element.id];
    changeLogoStyle(element);
  }

  updatePage(getDatabase());
});

//This code runs whenever the page is loaded.
//It copies the server database to local database

const copyServerDatabaseToLocalDatabase = () => {
  getServerDatabase()
    .then((serverDatabase) => {
      const localDatabase = serverDatabase.map((toDo) => {
        const copy = { ...toDo };
        copy.element = createToDoElement();
        addEventListenersToToDo(copy.element);
        return copy;
      });

      localDatabase.forEach((toDo) => {
        addToDataBase(toDo);
      });

      updatePage(getDatabase());
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

copyServerDatabaseToLocalDatabase();
