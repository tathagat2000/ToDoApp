export const queriedElements = {
  analyticsPercent: document.querySelector("#percent"),
  analyticsRatio: document.querySelector("#ratio"),
  createTodoBox: document.querySelector("#createTodo"),
  todoInput: document.querySelector("#addTodo"),
  urgency: document.querySelector("#urgency"),
  category: document.querySelector("#category"),
  deleteSelection: document.querySelector("#deleteSelection"),
  completeSelection: document.querySelector("#completeSelection"),
  incompleteSelection: document.querySelector("#incompleteSelection"),
  filterLogos: document.querySelector("#logos"),
  modal: document.querySelector("#myModal"),
  saveModal: document.querySelector("#save"),
  cancelModal: document.querySelector("#cancel"),
  updatedText: document.querySelector("#updatedAddTodo"),
  updatedUrgency: document.querySelector("#updatedUrgency"),
  updatedCategory: document.querySelector("#updatedCategory"),
  snackbar: document.querySelector("#snackbar"),
  headerDate: document.querySelector("#date"),
  todoList: document.querySelector("#todoList")
};

export const dataConstants = {
  EDITBUTTON: "edit",
  DELETEBUTTON: "delete",
  SELECTBUTTON: "select",
  COMPLETEBUTTON: "complete",
  TEXT: "text",
  TIME: "time",
  URGENCYICON: "urgencyIcon",
  CATEGORYICON: "categoryIcon"
};

export const mapFilterIdToValue = {
  low: "low",
  medium: "medium",
  high: "high",
  personal: "personal",
  academic: "academic",
  social: "social"
};
