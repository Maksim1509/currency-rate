export const parseData = (data) => {
  const keys = Object.keys(data.Valute);
  const res = keys.map((key) => data.Valute[key]);
  return res;
};

const monthToString = (month) => {
  const str = month + 1 > 10 ? month + 1 : `0${month + 1}`;
  return str;
};
const dayToString = (day) => (day > 10 ? day : `0${day}`);

export default () => {
  const milisecondsInDay = 86400000;
  const now = new Date().getTime();
  const previousDays = [];
  for (let i = 1; i <= 10; i += 1) {
    const previousDay = new Date(now - milisecondsInDay * i);
    previousDays.push(previousDay);
  }
  const mapedPreviousDays = previousDays.map((day) => {
    const yearStr = day.getFullYear();
    const monthStr = monthToString(day.getMonth());
    const dayStr = dayToString(day.getDate());
    const dateStr = `${yearStr}/${monthStr}/${dayStr}`;
    return dateStr;
  });
  return mapedPreviousDays;
};
