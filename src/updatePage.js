import { updateAnalytics } from "/src/analytics.js";
import { iconClasses } from "/src/toDoElement.js";
import { filterDatabase } from "/src/filter.js";
import { selectedList } from "/src/database.js";
import { queriedElements, dataConstants } from "/src/constants.js";

const setToDoText = (element, textValue) => {
  element.querySelector(
    `[data-type=${dataConstants.TEXT}]`
  ).innerHTML = textValue;
};

const setToDoUrgency = (element, urgencyValue) => {
  element.querySelector(`[data-type=${dataConstants.URGENCYICON}]`).className =
    "";
  element
    .querySelector(`[data-type=${dataConstants.URGENCYICON}]`)
    .classList.add(...iconClasses[urgencyValue]);
};

const setToDoCategory = (element, categoryValue) => {
  element.querySelector(`[data-type=${dataConstants.CATEGORYICON}]`).className =
    "";

  element
    .querySelector(`[data-type=${dataConstants.CATEGORYICON}]`)
    .classList.add(...iconClasses[categoryValue]);
};

const setToDoTime = (element, time) => {
  element.querySelector(`[data-type=${dataConstants.TIME}]`).innerHTML = time;
};

const setIsCompleted = (element, completed) => {
  if (completed) {
    element.style.opacity = 0.5;
    element.querySelector(
      `[data-button=${dataConstants.COMPLETEBUTTON}]`
    ).innerHTML = "Completed. Undo?";
  } else {
    element.style.opacity = 1;
    element.querySelector(
      `[data-button=${dataConstants.COMPLETEBUTTON}]`
    ).innerHTML = "Mark Complete";
  }
};

const setIsSelected = (element, selected) => {
  if (selected) {
    element.style.boxShadow = "0px 0px 2vh 1vh grey";
    element.querySelector(
      `[data-button=${dataConstants.SELECTBUTTON}]`
    ).style.backgroundColor = "red";
  } else {
    element.style.boxShadow = "";
    element.querySelector(
      `[data-button=${dataConstants.SELECTBUTTON}]`
    ).style.backgroundColor = "white";
  }
};

const setToDoId = (element, id) => {
  element.id = id;
};

export const updatePage = (database) => {
  queriedElements.toDoList.innerHTML = "";
  database.sort((toDo1, toDo2) => toDo1.id - toDo2.id);
  const filteredDatabase = filterDatabase(database);
  filteredDatabase.forEach((toDo) => {
    setToDoText(toDo.element, toDo.text);
    setToDoUrgency(toDo.element, toDo.urgency);
    setToDoCategory(toDo.element, toDo.category);
    setToDoTime(toDo.element, toDo.time);
    setIsSelected(toDo.element, selectedList.includes(toDo.id));
    setIsCompleted(toDo.element, toDo.isCompleted);
    setToDoId(toDo.element, toDo.id);

    queriedElements.toDoList.appendChild(toDo.element);
  });

  updateAnalytics(filteredDatabase);
};
