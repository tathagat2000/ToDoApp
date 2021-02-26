import "/src/updateHeaderDate.js";
import {
  createTodoInServerDatabase,
  deleteTodoInServerDatabase,
  bulkDeleteTodoInServerDatabase,
  bulkUpdateTodoInServerDatabase,
  updateTodoInServerDatabase,
  getServerDatabase
} from "/src/server.js";
import { createTodoElement } from "/src/todoElement.js";
import { updatePage } from "/src/updatePage.js";
import { filters } from "/src/filter.js";
import {
  addToDataBase,
  deleteFromDatabase,
  resetSelection,
  getDatabase,
  getCurrentTodoData,
  selectedList,
  findMaxId
} from "/src/database.js";

import { showModal } from "/src/modal.js";
import { showSnackbar } from "/src/snackbar.js";
import { addToHistory } from "/src/history.js";
import { updateToDatabase } from "./database.js";
import {
  queriedElements,
  dataConstants,
  mapFilterIdToValue
} from "./constants.js";

let todoId = 0;

const getTime = () => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  return date + ", " + time;
};

const resetValues = () => {
  queriedElements.todoInput.value = "";
  queriedElements.urgency.selectedIndex = 0;
  queriedElements.category.selectedIndex = 0;
};

const getTodoId = (path) => {
  for (const element of path) {
    if (element.classList?.contains("todo")) {
      return Number(element.id);
    }
  }
};

const getTodo = (id, database) => database.find((todo) => todo.id === id);

const completeButtonClicked = (id) => {
  const todo = getTodo(id, getDatabase());
  const { element, ...serverCopy } = todo;
  const localCopy = { ...todo };
  serverCopy.isCompleted = !serverCopy.isCompleted;
  localCopy.isCompleted = !localCopy.isCompleted;
  updateTodoInServerDatabase(id, serverCopy)
    .then(() => {
      const event = createEvent("update", id);
      updateToDatabase(localCopy);
      event.todoObjectAfter = { ...getTodo(id, getDatabase()) };
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
  const textValue = getCurrentTodoData(id, "text");
  const urgencyValue = getCurrentTodoData(id, "urgency");
  const categoryValue = getCurrentTodoData(id, "category");
  showModal(id, textValue, urgencyValue, categoryValue);
};

const createEvent = (type, id) => {
  return {
    operationType: type,
    todoObjectBefore: { ...getTodo(id, getDatabase()) }
  };
};

const deleteButtonClicked = (id) => {
  deleteTodoInServerDatabase(id)
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
  const id = getTodoId(path);
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

const addEventListenersToTodo = (element) => {
  element.addEventListener("click", (event) => {
    checkPathIfAnyButtonsClicked(event.path);
  });
};

const createTodoObject = (newTodoElement) => {
  return {
    id: todoId++,
    text: queriedElements.todoInput.value,
    urgency: queriedElements.urgency.value,
    category: queriedElements.category.value,
    isCompleted: false,
    time: getTime(),
    element: newTodoElement
  };
};

const addTodo = () => {
  const newTodoElement = createTodoElement();
  const todoObject = createTodoObject(newTodoElement);
  const { element, ...serverCopy } = todoObject;

  createTodoInServerDatabase(serverCopy)
    .then(() => {
      addToDataBase(todoObject);
      updatePage(getDatabase());
      resetValues();
      addEventListenersToTodo(newTodoElement);
      const event = createEvent("create", todoObject.id);
      addToHistory(event);
    })
    .catch((err) => {
      console.log(err);
      showSnackbar(err);
    });
};

queriedElements.createTodoBox.addEventListener("keypress", (event) => {
  const key = event.keyCode || event.which || 0;
  if (key === 13 && queriedElements.todoInput.value) {
    addTodo();
  }
});

const deleteInBulk = () => {
  const listOfTodoIdsToBeDeleted = selectedList;
  const event = {
    operationType: "bulkDelete"
  };
  const listOfTodoObjects = listOfTodoIdsToBeDeleted.map((id) => {
    return { ...getTodo(id, getDatabase()) };
  });
  event.todoObjectList = listOfTodoObjects;
  bulkDeleteTodoInServerDatabase(listOfTodoIdsToBeDeleted)
    .then(() => {
      listOfTodoIdsToBeDeleted.forEach((id) => {
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

const createBulkUpdateEvent = (listOfTodosToBeChanged, value) => {
  const event = {
    operationType: "bulkUpdate"
  };

  event.todoObjectListBefore = listOfTodosToBeChanged.map((todo) => {
    return { ...todo };
  });

  event.todoObjectListAfter = listOfTodosToBeChanged.map((todo) => {
    const copy = { ...todo };
    copy.isCompleted = value;
    return copy;
  });

  return event;
};

const markSelectionInBulk = (value) => {
  const listOfTodosToBeChanged = selectedList.map((id) =>
    getTodo(id, getDatabase())
  );

  const event = createBulkUpdateEvent(listOfTodosToBeChanged, value);

  const serverCopyOfListOfTodos = listOfTodosToBeChanged.map((todo) => {
    const { element, ...serverCopy } = todo;
    serverCopy.isCompleted = value;
    return serverCopy;
  });

  bulkUpdateTodoInServerDatabase(serverCopyOfListOfTodos)
    .then(() => {
      listOfTodosToBeChanged.forEach((todo) => {
        const localCopy = { ...todo };
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
  if (filters[mapFilterIdToValue[element.id]]) {
    element.style.fontSize = "35px";
  } else {
    element.style.fontSize = "20px";
  }
};

queriedElements.filterLogos.addEventListener("click", (event) => {
  const element = event.path.find((element) => {
    return element.tagName === "BUTTON";
  });

  if (element) {
    filters[mapFilterIdToValue[element.id]] = !filters[
      mapFilterIdToValue[element.id]
    ];
    changeLogoStyle(element);
  }

  updatePage(getDatabase());
});

//This code runs whenever the page is loaded.
//It copies the server database to local database

const setNewTodoId = () => {
  todoId = findMaxId() + 1;
};

const copyServerDatabaseToLocalDatabase = () => {
  getServerDatabase()
    .then((serverDatabase) => {
      const localDatabase = serverDatabase.map((todo) => {
        const copy = { ...todo };
        copy.element = createTodoElement();
        addEventListenersToTodo(copy.element);
        return copy;
      });

      localDatabase.forEach((todo) => {
        addToDataBase(todo);
      });

      updatePage(getDatabase());

      setNewTodoId();
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

copyServerDatabaseToLocalDatabase();
