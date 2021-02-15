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

export const createToDoInServerDatabase = (toDo) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      serverDatabase.push(toDo);
      resolve("done");
    } else {
      reject("Could Not Add ToDo");
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

      resolve("done");
    } else {
      reject("Could Not Delete Selected ToDos");
    }
  });
};

export const bulkChangeCompletedInServerDatabase = (listOfIds, value) => {
  return new Promise((resolve, reject) => {
    if (isServerWorking()) {
      listOfIds.forEach((id) => {
        const idx = serverDatabase.findIndex((toDo) => {
          return toDo.id === id;
        });

        serverDatabase[idx].isCompleted = value;
      });

      resolve("done");
    } else {
      if (value) reject("Could Not Mark Selected ToDos Completed");
      else reject("Could Not Mark Selected ToDos Incomplete");
    }
  });
};
