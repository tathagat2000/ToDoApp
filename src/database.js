// THIS IS MY LOCAL DATABASE

const database = [];

export const addToDataBase = (toDo) => {
  database.push(toDo);
};

export const deleteFromDatabase = (id) => {
  const idx = database.findIndex((toDo) => {
    return toDo.id === id;
  });

  database.splice(idx, 1);
};

const searchToDoBasedOnId = (id) => {
  return database.find((toDo) => {
    return toDo.id === id;
  });
};

export const resetSelectionInDatabase = () => {
  database.forEach((toDo) => {
    toDo.isSelected = 0;
  });
};

export const getDatabase = () => {
  return database;
};

export const getCurrentToDoTextFromDatabase = (id) => {
  const toDo = searchToDoBasedOnId(id);

  return toDo.text;
};

export const getCurrentUrgencySelectionFromDatabase = (id) => {
  const toDo = searchToDoBasedOnId(id);

  return toDo.urgency;
};

export const getCurrentCategorySelectionFromDatabase = (id) => {
  const toDo = searchToDoBasedOnId(id);

  return toDo.category;
};

export const updateToDatabase = (toDoObject) => {
  const id = toDoObject.id;
  const idx = database.findIndex((toDo) => {
    return toDo.id === id;
  });

  database[idx] = toDoObject;
};
