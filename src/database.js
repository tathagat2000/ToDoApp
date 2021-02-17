// THIS IS MY LOCAL DATABASE

const database = [];
export const selectedList = [];

export const addToDataBase = (toDo) => {
  database.push(toDo);
};

export const deleteFromDatabase = (id) => {
  const idx = database.findIndex((toDo) => {
    return toDo.id === id;
  });

  database.splice(idx, 1);
};

const getToDo = (id, database) => database.find((toDo) => toDo.id === id);

export const resetSelection = () => {
  selectedList.splice(0);
};

export const getDatabase = () => {
  return database;
};

export const getCurrentToDoData = (id, type) => {
  const toDo = getToDo(id, getDatabase());
  return toDo[type];
};

export const updateToDatabase = (toDoObject) => {
  const id = toDoObject.id;
  const idx = database.findIndex((toDo) => {
    return toDo.id === id;
  });

  database[idx] = toDoObject;
};
