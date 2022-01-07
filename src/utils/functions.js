const convertDateToMMDDYY = (date) => {
  const dateObject = new Date(date);
  const dd = String(dateObject.getDate()).padStart(2, "0");
  const mm = String(dateObject.getMonth() + 1).padStart(2, "0");
  const yy = String(dateObject.getFullYear()).substring(-2);

  return mm + "/" + dd + "/" + yy;
};

const getPastDate = (date, days) => {
  return new Date().setDate(date.getDate() - days);
};

export { convertDateToMMDDYY, getPastDate };
