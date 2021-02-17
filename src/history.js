import {
  addToDataBase,
  deleteFromDatabase,
  getDatabase,
  updateToDatabase
} from "/src/database.js";

import {
  createToDoInServerDatabase,
  deleteToDoInServerDatabase,
  updateToDoInServerDatabase,
  bulkUpdateToDoInServerDatabase,
  bulkDeleteToDoInServerDatabase,
  bulkCreateToDoInServerDatabase
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
  const id = event.toDoObjectBefore.id;
  deleteToDoInServerDatabase(id)
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
  const toDoObject = event.toDoObjectBefore;
  const { element, ...serverCopy } = toDoObject;

  createToDoInServerDatabase(serverCopy)
    .then(() => {
      addToDataBase(toDoObject);
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

const updateOperation = (toDoObject, type) => {
  const { element, ...serverCopy } = toDoObject;
  const id = toDoObject.id;
  updateToDoInServerDatabase(id, serverCopy)
    .then(() => {
      updateToDatabase(toDoObject);
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

const bulkUpdateOperation = (toDoObjectList, type) => {
  const serverCopy = toDoObjectList.map((toDo) => {
    const { element, ...copy } = toDo;
    return copy;
  });

  bulkUpdateToDoInServerDatabase(serverCopy)
    .then(() => {
      toDoObjectList.forEach((toDo) => {
        updateToDatabase(toDo);
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

const bulkDeleteOperation = (toDoObjectList, type) => {
  const listOfIds = toDoObjectList.map((toDo) => toDo.id);

  bulkDeleteToDoInServerDatabase(listOfIds)
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

const bulkCreateOperation = (toDoObjectList, type) => {
  const serverCopy = toDoObjectList.map((toDo) => {
    const { element, ...copy } = toDo;
    return copy;
  });

  const localCopy = toDoObjectList.map((toDo) => {
    return { ...toDo };
  });

  bulkCreateToDoInServerDatabase(serverCopy)
    .then(() => {
      localCopy.forEach((toDo) => {
        addToDataBase(toDo);
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
      updateOperation(event.toDoObjectBefore, "undo");
      break;

    case "bulkUpdate":
      bulkUpdateOperation(event.toDoObjectListBefore, "undo");
      break;

    case "bulkDelete":
      bulkCreateOperation(event.toDoObjectList, "undo");
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
      updateOperation(event.toDoObjectAfter, "redo");
      break;

    case "bulkUpdate":
      bulkUpdateOperation(event.toDoObjectListAfter, "redo");
      break;

    case "bulkDelete":
      bulkDeleteOperation(event.toDoObjectList, "redo");
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
