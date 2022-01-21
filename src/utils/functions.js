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

const getWeekNumber = (date) => {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
  return weekNumber;
};

const getDatesOfWeek = (date) => {
  const weekNumber = getWeekNumber(date);
  var d = new Date("Jan 01, " + date.getFullYear() + " 01:00:00");
  var dayMs = 24 * 60 * 60 * 1000;
  var offsetTimeStart = dayMs * (d.getDay() - 1);
  var w = d.getTime() + 604800000 * (weekNumber - 1) - offsetTimeStart;
  const first = new Date(w);
  const last = new Date(w + 518400000);
  return { dateFrom: first, dateTo: last };
};

const convertPriceFormat = (value, prefix = "") => {
  // $123.46 -> value: 123.46, prefix: $
  let valueString = value.toString();
  const decimal = valueString.split(".")[1] ?? "";
  let result = valueString.split(".")[0];
  result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  result = decimal !== "" ? result + "." + decimal : result;
  result = prefix + result;

  return result;
};

export {
  convertDateToMMDDYY,
  convertPriceFormat,
  getPastDate,
  getWeekNumber,
  getDatesOfWeek,
};
