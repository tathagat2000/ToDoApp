export const filters = {
  low: 0,
  medium: 0,
  high: 0,
  personal: 0,
  academic: 0,
  social: 0
};

const mapValueToFilter = {
  low: "low",
  medium: "medium",
  high: "high",
  personal: "personal",
  academic: "academic",
  social: "social"
};

export const filterDatabase = (database) => {
  const urgencyFilter = filters.low || filters.medium || filters.high;

  const categoryFilter = filters.personal || filters.academic || filters.social;

  if (urgencyFilter == 0 && categoryFilter == 0) {
    return database;
  }

  return database.filter((toDo) => {
    return (
      filters[mapValueToFilter[toDo.urgency]] ||
      filters[mapValueToFilter[toDo.category]]
    );
  });
};
