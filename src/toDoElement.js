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
    id: "editButton"
  };

  const deleteButton = {
    type: "button",
    classes: ["delete"],
    children: [deleteIcon],
    id: "deleteButton"
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
    id: "toDoText"
  };

  const time = {
    type: "div",
    classes: ["time"],
    children: [],
    id: "time"
  };

  const urgencyIcon = {
    type: "i",
    classes: [],
    children: [],
    id: "urgencyIcon"
  };

  const categoryIcon = {
    type: "i",
    classes: [],
    children: [],
    id: "categoryIcon"
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
    id: "completeButton",
    value: "Mark Complete"
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
    id: "select"
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
  const elementId = element.id;
  const elementValue = element.value;

  const newElement = document.createElement(elementType);
  newElement.classList.add(...elementClasses);

  if (elementId) {
    newElement.id = elementId;
  }

  if (elementValue) {
    newElement.innerHTML = elementValue;
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
