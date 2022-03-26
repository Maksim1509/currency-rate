import getPreviousTenDays, { parseData } from './utils.js';

const state = {
  select: null,
};

const getData = async (path) => {
  const res = await fetch(path);
  const data = await res.json();
  return data;
};

const buildRow = ({
  CharCode, Value, Previous, Name,
}) => {
  const trend = Value > Previous ? '▲' : '▼';
  const color = Value > Previous ? 'red' : 'green';
  const diff = (Math.abs(((Previous - Value) / Value) * 100)).toFixed(2);
  return `<li class="list-item" id="${CharCode}">
    <span class="code">${CharCode}</span>
    <span class="value">${Value}</span>
    <span class="diff ${color}">${trend} ${diff}%</span>
    <div class="previous-days"></div>
    <div class="tooltip">${Name}</div>
  </li>`;
};

const tooltipHide = (target) => () => {
  const targetTooltip = target.querySelector('.tooltip');
  targetTooltip.style.display = 'block';
};
const tooltipShow = (target) => () => {
  const targetTooltip = target.querySelector('.tooltip');
  targetTooltip.style.display = 'none';
};

const clickHandler = (target) => async (e) => {
  e.stopPropagation();
  const dataPreviousDays = target.querySelector('.previous-days');
  const selectedValute = target.getAttribute('id');
  if (state.select === selectedValute) {
    dataPreviousDays.textContent = '';
    state.select = null;
    return;
  }
  if (state.select) {
    const seleted = document.getElementById(state.select).querySelector('.previous-days');
    seleted.textContent = '';
  }
  state.select = selectedValute;

  const previousTenDays = getPreviousTenDays();
  const promises = [];
  for (let i = 0; i < previousTenDays.length; i += 1) {
    promises.push(getData(`https://www.cbr-xml-daily.ru/archive/${previousTenDays[i]}/daily_json.js`)
      .catch(() => `${previousTenDays[i]} - нет данных`));
  }
  const result = await Promise.all(promises);
  const content = result.map((data, i) => {
    if (typeof data === 'string') return data;
    return `${previousTenDays[i]}: <b>${data.Valute[state.select].Value}</b>`;
  });
  const html = `<ul>${content.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  dataPreviousDays.innerHTML = html;
};

const hideDataPreviousDays = () => {
  if (!state.select) {
    return;
  }
  const seleted = document.getElementById(state.select).querySelector('.previous-days');
  seleted.textContent = '';
  state.select = null;
};

document.addEventListener('click', hideDataPreviousDays);

export default async () => {
  const main = document.querySelector('.main-container');
  const url = 'https://www.cbr-xml-daily.ru/daily_json.js';
  try {
    const data = await getData(url);
    const parsed = parseData(data);
    main.innerHTML = `<ul class="list">${parsed.map((valute) => buildRow(valute)).join(' ')}</ul>`;
    const listValutes = document.querySelectorAll('.list-item');
    listValutes.forEach((target) => {
      target.addEventListener('mouseover', tooltipHide(target));
      target.addEventListener('mouseout', tooltipShow(target));
      target.addEventListener('click', clickHandler(target));
    });
  } catch (e) {
    console.log(e);
  }
};
