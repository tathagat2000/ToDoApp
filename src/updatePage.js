import { updateAnalytics } from "./analytics.js";
import { iconClasses } from "./todoElement.js";
import { filterDatabase } from "./filter.js";
import { selectedList } from "./database.js";
import { queriedElements, dataConstants } from "./constants.js";

const setTodoText = (element, textValue) => {
  element.querySelector(
    `[data-type=${dataConstants.TEXT}]`
  ).innerHTML = textValue;
};

const setTodoUrgency = (element, urgencyValue) => {
  element.querySelector(`[data-type=${dataConstants.URGENCYICON}]`).className =
    "";
  element
    .querySelector(`[data-type=${dataConstants.URGENCYICON}]`)
    .classList.add(...iconClasses[urgencyValue]);
};

const setTodoCategory = (element, categoryValue) => {
  element.querySelector(`[data-type=${dataConstants.CATEGORYICON}]`).className =
    "";

  element
    .querySelector(`[data-type=${dataConstants.CATEGORYICON}]`)
    .classList.add(...iconClasses[categoryValue]);
};

const setTodoTime = (element, time) => {
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

const setTodoId = (element, id) => {
  element.id = id;
};

export const updatePage = (database) => {
  queriedElements.todoList.innerHTML = "";
  database.sort((todo1, todo2) => todo1.id - todo2.id);
  const filteredDatabase = filterDatabase(database);
  filteredDatabase.forEach((todo) => {
    setTodoText(todo.element, todo.text);
    setTodoUrgency(todo.element, todo.urgency);
    setTodoCategory(todo.element, todo.category);
    setTodoTime(todo.element, todo.time);
    setIsSelected(todo.element, selectedList.includes(todo.id));
    setIsCompleted(todo.element, todo.isCompleted);
    setTodoId(todo.element, todo.id);

    queriedElements.todoList.appendChild(todo.element);
  });

  updateAnalytics(filteredDatabase);
};
