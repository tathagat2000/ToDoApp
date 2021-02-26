import { queriedElements } from "./constants.js";

export const updateAnalytics = (database) => {
  const denominator = database.length;
  const numerator = database.filter((todo) => {
    return todo.isCompleted;
  }).length;

  queriedElements.analyticsRatio.innerHTML = numerator + " / " + denominator;
  let value;
  if (denominator === 0) value = 0;
  else value = Math.round((numerator * 100) / denominator);
  queriedElements.analyticsPercent.innerHTML = value + " % ";
};
