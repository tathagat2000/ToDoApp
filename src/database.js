// THIS IS MY LOCAL DATABASE

const database = [];
export const selectedList = [];

export const findMaxId = () => {
  let max = -1;

  database.forEach((todo) => {
    max = Math.max(max, todo.id);
  });

  return max;
};

export const addToDataBase = (todo) => {
  database.push(todo);
};

export const deleteFromDatabase = (id) => {
  const idx = database.findIndex((todo) => {
    return todo.id === id;
  });

  database.splice(idx, 1);
};

const getTodo = (id, database) => database.find((todo) => todo.id === id);

export const resetSelection = () => {
  selectedList.splice(0);
};

export const getDatabase = () => {
  return database;
};

export const getCurrentTodoData = (id, type) => {
  const todo = getTodo(id, getDatabase());
  return todo[type];
};

export const updateToDatabase = (todoObject) => {
  const id = todoObject.id;
  const idx = database.findIndex((todo) => {
    return todo.id === id;
  });

  database[idx] = todoObject;
};
