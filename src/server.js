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
  localStorage.setItem("todos", JSON.stringify(serverDatabase));
};

const loadDatabaseFromLocalStorage = () => {
  serverDatabase = JSON.parse(localStorage.getItem("todos")) || [];
};

export const createTodoInServerDatabase = (todo) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      serverDatabase.push(todo);
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Add Todo");
    }
  });
};

export const bulkCreateTodoInServerDatabase = (listOfTodos) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      listOfTodos.forEach((todo) => {
        serverDatabase.push(todo);
      });
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Add Bulk Todos");
    }
  });
};

export const updateTodoInServerDatabase = (id, todo) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      const idx = serverDatabase.findIndex((todo) => {
        return todo.id === id;
      });
      serverDatabase[idx] = todo;
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Update In Database");
    }
  });
};

export const deleteTodoInServerDatabase = (id) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      const idx = serverDatabase.findIndex((todo) => {
        return todo.id === id;
      });
      serverDatabase.splice(idx, 1);
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Delete Todo");
    }
  });
};

export const bulkDeleteTodoInServerDatabase = (listOfIds) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      listOfIds.forEach((id) => {
        const idx = serverDatabase.findIndex((todo) => {
          return todo.id === id;
        });

        serverDatabase.splice(idx, 1);
      });
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Delete Selected Todos");
    }
  });
};

export const bulkUpdateTodoInServerDatabase = (listOfTodos) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      listOfTodos.forEach((todo) => {
        const id = todo.id;
        const idx = serverDatabase.findIndex((todo) => {
          return todo.id === id;
        });
        serverDatabase[idx] = todo;
      });
      saveDatabaseInLocalStorage();
      resolve("done");
    } else {
      reject("Could Not Update Selected Todos");
    }
  });
};

loadDatabaseFromLocalStorage();
