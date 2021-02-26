import { dataConstants } from "./constants.js";

const initializeTodoElement = () => {
  const editIcon = {
    type: "i",
    classes: ["fa", "fa-edit"],
    children: []
  };

  const deleteIcon = {
    type: "i",
    classes: ["fa", "fa-trash"],
    children: []
  };

  const editButton = {
    type: "button",
    classes: ["edit"],
    children: [editIcon],
    properties: {
      "data-button": dataConstants.EDITBUTTON
    }
  };

  const deleteButton = {
    type: "button",
    classes: ["delete"],
    children: [deleteIcon],
    properties: {
      "data-button": dataConstants.DELETEBUTTON
    }
  };

  const buttons = {
    type: "div",
    classes: ["buttons"],
    children: [editButton, deleteButton]
  };

  const todoText = {
    type: "div",
    classes: ["todoText"],
    children: [],
    properties: {
      "data-type": dataConstants.TEXT
    }
  };

  const time = {
    type: "div",
    classes: ["time"],
    children: [],
    properties: {
      "data-type": dataConstants.TIME
    }
  };

  const urgencyIcon = {
    type: "i",
    classes: [],
    children: [],
    properties: {
      "data-type": dataConstants.URGENCYICON
    }
  };

  const categoryIcon = {
    type: "i",
    classes: [],
    children: [],
    properties: {
      "data-type": dataConstants.CATEGORYICON
    }
  };

  const symbols = {
    type: "div",
    classes: ["symbols"],
    children: [urgencyIcon, categoryIcon]
  };

  const completeButton = {
    type: "button",
    classes: ["completeButton"],
    children: [],
    properties: {
      innerHTML: "Mark Complete",
      "data-button": dataConstants.COMPLETEBUTTON
    }
  };

  const complete = {
    type: "div",
    classes: ["complete"],
    children: [completeButton]
  };

  const select = {
    type: "div",
    classes: ["notSelect"],
    children: [],
    properties: {
      "data-button": dataConstants.SELECTBUTTON
    }
  };

  const todoElement = {
    type: "div",
    classes: ["todo"],
    children: [buttons, todoText, time, symbols, complete, select]
  };

  return todoElement;
};

const todoElement = initializeTodoElement();

export const createTodoElement = (element = todoElement) => {
  const elementType = element.type;
  const elementClasses = element.classes;

  const newElement = document.createElement(elementType);
  newElement.classList.add(...elementClasses);

  for (const property in element.properties) {
    const value = element.properties[property];
    newElement.setAttribute(property, value);
  }

  element.children.forEach((childElement) => {
    newElement.appendChild(createTodoElement(childElement));
  });

  return newElement;
};

export const iconClasses = {
  low: ["grey", "fa", "fa-exclamation-triangle"],
  medium: ["orange", "fa", "fa-exclamation-triangle"],
  high: ["red", "fa", "fa-exclamation-triangle"],
  personal: ["blue", "fa", "fa-user"],
  academic: ["grey", "fa", "fa-book"],
  social: ["pink", "fa", "fa-users"]
};
