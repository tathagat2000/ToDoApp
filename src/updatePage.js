import { updateAnalytics } from "/src/analytics.js";
import { iconClasses } from "/src/toDoElement.js";
import { filterDatabase } from "/src/filter.js";

const toDoList = document.querySelector("#toDoList");

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

const setToDoTime = (element, time) => {
  element.querySelector("#time").innerHTML = time;
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

export const updatePage = (database) => {
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
