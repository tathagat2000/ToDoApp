const analyticsPercent = document.querySelector("#percent");
const analyticsRatio = document.querySelector("#ratio");

export const updateAnalytics = (database) => {
  const denominator = database.length;
  const numerator = database.filter((toDo) => {
    return toDo.isCompleted;
  }).length;

  analyticsRatio.innerHTML = numerator + " / " + denominator;
  let value;
  if (denominator === 0) value = 0;
  else value = Math.round((numerator * 100) / denominator);
  analyticsPercent.innerHTML = value + " % ";
};
