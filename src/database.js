let toDoId = 0;
const database = [];
const toDoInput = document.querySelector("#addToDo");
const urgency = document.querySelector("#urgency");
const category = document.querySelector("#category");

export const addToDataBase = (element, currentTime) => {
  database.push({
    id: toDoId++,
    text: toDoInput.value,
    urgency: urgency.value,
    category: category.value,
    isSelected: false,
    isCompleted: false,
    time: currentTime,
    element: element
  });
};

export const deleteFromDatabase = (id) => {
  const idx = database.findIndex((toDo) => {
    return toDo.id === id;
  });

  database.splice(idx, 1);
};

export const resetSelectionInDatabase = () => {
  database.forEach((toDo) => {
    toDo.isSelected = 0;
  });
};

export const changeCompletedInDatabase = (id, val) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  toDo[0].isCompleted = val;
};

export const toggleCompleteInDatabase = (id) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  toDo[0].isCompleted = toDo[0].isCompleted ^ 1;
};

export const toggleSelectInDatabase = (id) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  toDo[0].isSelected = toDo[0].isSelected ^ 1;
};

export const getDatabase = () => {
  return database;
};

export const getCurrentToDoTextFromDatabase = (id) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  return toDo[0].text;
};

export const getCurrentUrgencySelectionFromDatabase = (id) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  return toDo[0].urgency;
};

export const getCurrentCategorySelectionFromDatabase = (id) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  return toDo[0].category;
};

export const updateDatabase = (id, text, urgency, category) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  toDo[0].text = text;
  toDo[0].urgency = urgency;
  toDo[0].category = category;
};
