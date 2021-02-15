import {
  addToDataBase,
  deleteFromDatabase,
  getDatabase,
  updateToDatabase
} from "/src/database.js";

import {
  createToDoInServerDatabase,
  deleteToDoInServerDatabase,
  updateToDoInServerDatabase
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
  const { isSelected, element, ...serverCopy } = { ...toDoObject };

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
  const { isSelected, element, ...serverCopy } = { ...toDoObject };
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

const undo = () => {
  console.log("undo", historyIndex, history);
  const event = history[historyIndex];
  if (!event) {
    showSnackbar("Cannot Undo. Haven't performed an operation yet");
    return;
  }

  if (event.operationType === "delete") {
    createOperation(event, "undo");
  } else if (event.operationType === "create") {
    deleteOperation(event, "undo");
  } else if (event.operationType === "update") {
    updateOperation(event.toDoObjectBefore, "undo");
  }
};

const redo = () => {
  console.log("redo", historyIndex, history);
  const event = history[historyIndex + 1];
  console.log(event);

  if (!event) {
    showSnackbar("Cannot Redo. Haven't undone an operation yet");
    return;
  }

  if (event.operationType === "delete") {
    deleteOperation(event, "redo");
  } else if (event.operationType === "create") {
    createOperation(event, "redo");
  } else if (event.operationType === "update") {
    updateOperation(event.toDoObjectAfter, "redo");
  }
};

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "z") {
    undo();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key.toLowerCase() === "y") {
    redo();
  }
});
