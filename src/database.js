// THIS IS MY LOCAL DATABASE

let toDoId = 0;
const database = [];
const toDoInput = document.querySelector("#addToDo");
const urgency = document.querySelector("#urgency");
const category = document.querySelector("#category");

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

export const changeCompletedInDatabase = (id, val) => {
  const toDo = searchToDoBasedOnId(id);

  toDo.isCompleted = val;
};

export const toggleCompleteInDatabase = (id) => {
  const toDo = searchToDoBasedOnId(id);

  toDo.isCompleted ^= 1;
};

export const toggleSelectInDatabase = (id) => {
  const toDo = searchToDoBasedOnId(id);

  toDo.isSelected ^= 1;
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

export const updateDatabase = (id, text, urgency, category) => {
  const toDo = searchToDoBasedOnId(id);

  toDo.text = text;
  toDo.urgency = urgency;
  toDo.category = category;
};
