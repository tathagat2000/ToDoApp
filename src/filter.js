export const filters = {
  low: 0,
  medium: 0,
  high: 0,
  personal: 0,
  academic: 0,
  social: 0
};

export const filterDatabase = (database) => {
  let urgencyFilter = filters.low | filters.medium | filters.high;

  let categoryFilter = filters.personal | filters.academic | filters.social;

  if (urgencyFilter === 0 && categoryFilter === 0) {
    return database;
  }

  return database.filter((toDo) => {
    return filters[toDo.urgency] | filters[toDo.category];
  });
};