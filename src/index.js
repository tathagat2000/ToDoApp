import { createToDoElement, iconClasses } from "/src/toDoElement.js";
import "/src/rough.js";
import "/src/updatePageDate.js";
import { updateAnalytics } from "/src/analytics.js";

const createToDoBox = document.querySelector("#createToDo");
const toDoInput = document.querySelector("#addToDo");
const urgency = document.querySelector("#urgency");
const category = document.querySelector("#category");
const toDoList = document.querySelector("#toDoList");
const deleteSelection = document.querySelector("#deleteSelection");
const completeSelection = document.querySelector("#completeSelection");
const incompleteSelection = document.querySelector("#incompleteSelection");
const filterLogos = document.querySelector("#logos");
let toDoId = 0;
const database = [];

const filters = {
  low: 0,
  medium: 0,
  high: 0,
  personal: 0,
  academic: 0,
  social: 0
};

const filterDatabase = (database) => {
  let urgencyFilter = filters.low | filters.medium | filters.high;

  let categoryFilter = filters.personal | filters.academic | filters.social;

  if (urgencyFilter === 0 && categoryFilter === 0) {
    return database;
  }

  return database.filter((toDo) => {
    return filters[toDo.urgency] | filters[toDo.category];
  });
};

const setToDoText = (element, textValue) => {
  element.querySelector("#toDoText").innerHTML = textValue;
};

const setToDoUrgency = (element, urgencyValue) => {
  element.querySelector("#urgencyIcon").className = "";
  element
    .querySelector("#urgencyIcon")
    .classList.add(...iconClasses[urgencyValue]);
};

const setToDoCategory = (element, categoryValue) => {
  element.querySelector("#categoryIcon").className = "";

  element
    .querySelector("#categoryIcon")
    .classList.add(...iconClasses[categoryValue]);
};

const getTime = () => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  return date + ", " + time;
};

const setToDoTime = (element, time) => {
  element.querySelector("#time").innerHTML = time;
};

const resetValues = () => {
  toDoInput.value = "";
  urgency.selectedIndex = 0;
  category.selectedIndex = 0;
};

const setIsCompleted = (element, completed) => {
  if (completed) {
    element.style.opacity = 0.5;
    element.querySelector("#completeButton").innerHTML = "Completed. Undo?";
  } else {
    element.style.opacity = 1;
    element.querySelector("#completeButton").innerHTML = "Mark Complete";
  }
};

const setIsSelected = (element, selected) => {
  if (selected) {
    element.style.boxShadow = "0px 0px 2vh 1vh grey";
    element.querySelector("#select").style.backgroundColor = "red";
  } else {
    element.style.boxShadow = "";
    element.querySelector("#select").style.backgroundColor = "white";
  }
};

const setToDoId = (element, id) => {
  element.id = id;
};

const updatePage = (database) => {
  toDoList.innerHTML = "";
  const filteredDatabase = filterDatabase(database);
  filteredDatabase.forEach((toDo) => {
    setToDoText(toDo.element, toDo.text);
    setToDoUrgency(toDo.element, toDo.urgency);
    setToDoCategory(toDo.element, toDo.category);
    setToDoTime(toDo.element, toDo.time);
    setIsSelected(toDo.element, toDo.isSelected);
    setIsCompleted(toDo.element, toDo.isCompleted);
    setToDoId(toDo.element, toDo.id);

    toDoList.appendChild(toDo.element);
  });

  updateAnalytics(filteredDatabase);
};

const addToDataBase = (element, currentTime) => {
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

const getToDoId = (path) => {
  for (const element of path) {
    if (element.classList?.contains("toDo")) {
      return Number(element.id);
    }
  }
};

const toggleCompleteInDatabase = (id) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  toDo[0].isCompleted = toDo[0].isCompleted ^ 1;
};

const changeCompletedInDatabase = (id, val) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  toDo[0].isCompleted = val;
};

const toggleSelectInDatabase = (id) => {
  const toDo = database.filter((toDo) => {
    return toDo.id === id;
  });

  toDo[0].isSelected = toDo[0].isSelected ^ 1;
};

const deleteFromDatabase = (id) => {
  const idx = database.findIndex((toDo) => {
    return toDo.id === id;
  });

  database.splice(idx, 1);
};

const checkPathIfAnyButtonsClicked = (path) => {
  const id = getToDoId(path);
  for (const element of path) {
    if (element.id === "completeButton") {
      toggleCompleteInDatabase(id);
      updatePage(database);
      break;
    } else if (element.id === "select") {
      toggleSelectInDatabase(id);
      updatePage(database);
      break;
    } else if (element.id === "editButton") {
      console.log("edit clicked");
      break;
    } else if (element.id === "deleteButton") {
      deleteFromDatabase(id);
      updatePage(database);
      break;
    }
  }
};

const addEventListenersToToDo = (element) => {
  element.addEventListener("click", (event) => {
    checkPathIfAnyButtonsClicked(event.path);
  });
};

createToDoBox.addEventListener("keypress", (event) => {
  const key = event.keyCode || event.which || 0;
  if (key === 13 && toDoInput.value) {
    const currentTime = getTime();
    const newToDoElement = createToDoElement();
    addToDataBase(newToDoElement, currentTime);
    updatePage(database);
    resetValues();
    addEventListenersToToDo(newToDoElement);
  }
});

const getSelectedToDo = (database) => {
  return database.filter((toDo) => {
    return toDo.isSelected;
  });
};

deleteSelection.addEventListener("click", (event) => {
  const filteredDatabase = getSelectedToDo(database);
  filteredDatabase.forEach((toDo) => {
    deleteFromDatabase(toDo.id);
  });

  updatePage(database);
});

const resetSelectionInDatabase = (database) => {
  database.forEach((toDo) => {
    toDo.isSelected = 0;
  });
};

completeSelection.addEventListener("click", (event) => {
  const filteredDatabase = getSelectedToDo(database);
  filteredDatabase.forEach((toDo) => {
    changeCompletedInDatabase(toDo.id, 1);
  });
  resetSelectionInDatabase(database);
  updatePage(database);
});

incompleteSelection.addEventListener("click", (event) => {
  const filteredDatabase = getSelectedToDo(database);
  filteredDatabase.forEach((toDo) => {
    changeCompletedInDatabase(toDo.id, 0);
  });
  resetSelectionInDatabase(database);
  updatePage(database);
});

const changeLogoStyle = (element) => {
  if (filters[element.id]) {
    element.style.fontSize = "2vw";
  } else {
    element.style.fontSize = "1.2vw";
  }
};

filterLogos.addEventListener("click", (event) => {
  const element = event.path.find((element) => {
    return element.tagName === "BUTTON";
  });

  if (element) {
    filters[element.id] ^= 1;
    changeLogoStyle(element);
  }

  updatePage(database);
});
