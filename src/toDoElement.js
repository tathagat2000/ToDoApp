import { dataConstants } from "/src/constants.js";

const init = () => {
  const editIcon = {
    type: "i",
    classes: ["far", "fa-edit"],
    children: []
  };

  const deleteIcon = {
    type: "i",
    classes: ["fas", "fa-trash-alt"],
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

  const toDoText = {
    type: "div",
    classes: ["toDoText"],
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

  const toDoElement = {
    type: "div",
    classes: ["toDo"],
    children: [buttons, toDoText, time, symbols, complete, select]
  };

  return toDoElement;
};

const toDoElement = init();

export const createToDoElement = (element = toDoElement) => {
  const elementType = element.type;
  const elementClasses = element.classes;

  const newElement = document.createElement(elementType);
  newElement.classList.add(...elementClasses);

  for (const property in element.properties) {
    const value = element.properties[property];
    newElement.setAttribute(property, value);
  }

  element.children.forEach((childElement) => {
    newElement.appendChild(createToDoElement(childElement));
  });

  return newElement;
};

export const iconClasses = {
  low: ["grey", "fas", "fa-exclamation-triangle"],
  medium: ["orange", "fas", "fa-exclamation-triangle"],
  high: ["red", "fas", "fa-exclamation-triangle"],
  personal: ["blue", "fas", "fa-user"],
  academic: ["grey", "fas", "fa-book-open"],
  social: ["pink", "fas", "fa-users"]
};
