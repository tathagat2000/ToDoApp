import {
  addToDataBase,
  deleteFromDatabase,
  getDatabase,
  updateToDatabase
} from "/src/database.js";

import {
  createTodoInServerDatabase,
  deleteTodoInServerDatabase,
  updateTodoInServerDatabase,
  bulkUpdateTodoInServerDatabase,
  bulkDeleteTodoInServerDatabase,
  bulkCreateTodoInServerDatabase
} from "/src/server.js";

import { updatePage } from "/src/updatePage.js";
import { showSnackbar } from "/src/snackbar.js";

let historyIndex = -1;
const history = [];

export const addToHistory = (event) => {
  history.splice(historyIndex + 1);
  history.push(event);
  historyIndex++;
};

const deleteOperation = (event, type) => {
  const id = event.todoObjectBefore.id;
  deleteTodoInServerDatabase(id)
    .then(() => {
      deleteFromDatabase(id);
      updatePage(getDatabase());

      if (type === "undo") {
        historyIndex--;
      } else {
        historyIndex++;
      }
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const createOperation = (event, type) => {
  const todoObject = event.todoObjectBefore;
  const { element, ...serverCopy } = todoObject;

  createTodoInServerDatabase(serverCopy)
    .then(() => {
      addToDataBase(todoObject);
      updatePage(getDatabase());

      if (type === "undo") {
        historyIndex--;
      } else {
        historyIndex++;
      }
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const updateOperation = (todoObject, type) => {
  const { element, ...serverCopy } = todoObject;
  const id = todoObject.id;
  updateTodoInServerDatabase(id, serverCopy)
    .then(() => {
      updateToDatabase(todoObject);
      updatePage(getDatabase());

      if (type === "undo") {
        historyIndex--;
      } else {
        historyIndex++;
      }
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const bulkUpdateOperation = (todoObjectList, type) => {
  const serverCopy = todoObjectList.map((todo) => {
    const { element, ...copy } = todo;
    return copy;
  });

  bulkUpdateTodoInServerDatabase(serverCopy)
    .then(() => {
      todoObjectList.forEach((todo) => {
        updateToDatabase(todo);
      });
      updatePage(getDatabase());
      if (type === "undo") {
        historyIndex--;
      } else {
        historyIndex++;
      }
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const bulkDeleteOperation = (todoObjectList, type) => {
  const listOfIds = todoObjectList.map((todo) => todo.id);

  bulkDeleteTodoInServerDatabase(listOfIds)
    .then(() => {
      listOfIds.forEach((id) => {
        deleteFromDatabase(id);
      });
      updatePage(getDatabase());
      if (type === "undo") {
        historyIndex--;
      } else {
        historyIndex++;
      }
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const bulkCreateOperation = (todoObjectList, type) => {
  const serverCopy = todoObjectList.map((todo) => {
    const { element, ...copy } = todo;
    return copy;
  });

  const localCopy = todoObjectList.map((todo) => {
    return { ...todo };
  });

  bulkCreateTodoInServerDatabase(serverCopy)
    .then(() => {
      localCopy.forEach((todo) => {
        addToDataBase(todo);
      });
      updatePage(getDatabase());
      if (type === "undo") {
        historyIndex--;
      } else {
        historyIndex++;
      }
    })
    .catch((err) => {
      showSnackbar(err);
    });
};

const undo = () => {
  const event = history[historyIndex];
  if (!event) {
    showSnackbar("Cannot Undo. Haven't performed an operation yet");
    return;
  }

  switch (event.operationType) {
    case "delete":
      createOperation(event, "undo");
      break;

    case "create":
      deleteOperation(event, "undo");
      break;

    case "update":
      updateOperation(event.todoObjectBefore, "undo");
      break;

    case "bulkUpdate":
      bulkUpdateOperation(event.todoObjectListBefore, "undo");
      break;

    case "bulkDelete":
      bulkCreateOperation(event.todoObjectList, "undo");
      break;

    default:
      break;
  }
};

const redo = () => {
  const event = history[historyIndex + 1];
  if (!event) {
    showSnackbar("Cannot Redo. Haven't undone an operation yet");
    return;
  }

  switch (event.operationType) {
    case "delete":
      deleteOperation(event, "redo");
      break;

    case "create":
      createOperation(event, "redo");
      break;

    case "update":
      updateOperation(event.todoObjectAfter, "redo");
      break;

    case "bulkUpdate":
      bulkUpdateOperation(event.todoObjectListAfter, "redo");
      break;

    case "bulkDelete":
      bulkDeleteOperation(event.todoObjectList, "redo");
      break;

    default:
      break;
  }
};

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
    undo();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
    redo();
    event.preventDefault();
  }
});
