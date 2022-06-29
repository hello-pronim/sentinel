const convertDateToMMDDYY = (date) => {
  const dateObject = new Date(date);
  const dd = String(dateObject.getDate()).padStart(2, "0");
  const mm = String(dateObject.getMonth() + 1).padStart(2, "0");
  const yy = String(dateObject.getFullYear()).substring(-2);

  return mm + "/" + dd + "/" + yy;
};

function convertMMDDYYYYDateStringToTime(dateString) {
  const dd = dateString.split("-")[1];
  const mm = dateString.split("-")[0];
  const yy = dateString.split("-")[2];
  const time = new Date(yy, mm - 1, dd).getTime();

  return time;
}

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

const convertPriceFormat = (value, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
  }).format(value);
};

const convertPercentFormat = (value, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
  }).format(value);
};

const convertNumberFormat = (value) => {
  return new Intl.NumberFormat().format(value);
};

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getColorFromString(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
}

export {
  convertDateToMMDDYY,
  convertMMDDYYYYDateStringToTime,
  convertPriceFormat,
  convertPercentFormat,
  convertNumberFormat,
  getPastDate,
  getWeekNumber,
  getDatesOfWeek,
  getColorFromString,
  getRandomColor,
};
