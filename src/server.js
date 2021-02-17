// THIS IS MY SERVER SIDE DATABASE

let serverDatabase = [];
const serverFailProbability = 0;

const isServerWorking = () => {
  const current = Math.random();
  if (current > serverFailProbability) {
    return true;
  }

  return false;
};

export const getServerDatabase = () => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      resolve(serverDatabase);
    } else {
      reject("Please Refresh Again");
    }
  });
};

const saveDatabaseInLocalStorage = () => {
  localStorage.setItem("toDos", JSON.stringify(serverDatabase));
};

const loadDatabaseFromLocalStorage = () => {
  serverDatabase = JSON.parse(localStorage.getItem("toDos")) || [];
};

export const createToDoInServerDatabase = (toDo) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      serverDatabase.push(toDo);
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Add ToDo");
    }
  });
};

export const bulkCreateToDoInServerDatabase = (listOfToDos) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      listOfToDos.forEach((toDo) => {
        serverDatabase.push(toDo);
      });
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Add Bulk ToDos");
    }
  });
};

export const updateToDoInServerDatabase = (id, toDo) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      const idx = serverDatabase.findIndex((toDo) => {
        return toDo.id === id;
      });
      serverDatabase[idx] = toDo;
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Update In Database");
    }
  });
};

export const deleteToDoInServerDatabase = (id) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      const idx = serverDatabase.findIndex((toDo) => {
        return toDo.id === id;
      });
      serverDatabase.splice(idx, 1);
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Delete ToDo");
    }
  });
};

export const bulkDeleteToDoInServerDatabase = (listOfIds) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      listOfIds.forEach((id) => {
        const idx = serverDatabase.findIndex((toDo) => {
          return toDo.id === id;
        });

        serverDatabase.splice(idx, 1);
      });
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Delete Selected ToDos");
    }
  });
};

export const bulkUpdateToDoInServerDatabase = (listOfToDos) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      listOfToDos.forEach((toDo) => {
        const id = toDo.id;
        const idx = serverDatabase.findIndex((toDo) => {
          return toDo.id === id;
        });
        serverDatabase[idx] = toDo;
      });
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Update Selected ToDos");
    }
  });
};

loadDatabaseFromLocalStorage();
