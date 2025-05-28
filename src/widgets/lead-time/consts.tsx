export const BOARD_STAGE_FILTER_FIELDS = {
    "Релиз": "BoardStage: Релиз",
    "Готово": "BoardStage: Готово",
    "Вышло в релиз": "BoardStage: {Вышло в релиз}",
    "Done": "BoardStage: Done",
}

export const TASK_HIERARCHY_FILTER_FIELDS = {
    "Feature": "{Task hierarchy}: Feature",
    "Фича": "{Task hierarchy}: Фича",
}

export  const PREDEFINED_COLORS = [
  "rgb(249, 194, 75)",
  "rgb(208, 136, 5)",
  "rgb(230, 108, 55)",
  "rgb(22, 101, 108)",
  "rgb(195, 193, 195)",
  "rgb(171, 189, 133)",
  "rgb(173, 203, 218)",
  "#8d69b8",
  "#f19d99",
  "#c53a32",
  "#a8dd93",
  "#519e3e",
  "#f5be82",
  "#ef8636",
  "#b3c6e5",
];

export const GROUP_LIST = {
  "week": "Неделя",
  "month": "Месяц",
  "quarter": "Квартал",
  "year": "Год",
}

export const TYPE_GRAPH = ["Discovery", "Delivery"];

export const UNITS_OF_MEASUREMENT = {
  milliseconds: {
    name: "Миллисекунды",
    value: 1,
  },
  seconds: {
    name: "Секунды",
    value: 1000,
  }
  ,
  minutes: {
    name: "Минуты",
    value: 60000,
  },
  hours: {
    name: "Часы",
    value: 3600000,
  },
  days: {
    name: "Дни",
    value: 86400000,
  }
}

export const NUMBER_OF_CHARACTERS = 2;
export const DEFAULT_COUNT_WEEK = 25;
export const DEFAULT_COUNT_WEEK_FOR_SAVE = 20;
export const DAYS_IN_WEEK = 7;
export const MONTHS_IN_QUARTER = 3;
export const MONTHS_IN_YEAR = 12;
export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_MINUTE = 60;
export const MILLISECONDS_IN_DAY = 86400000;
export const MILLISECONDS_IN_MINUTES = 60000;
export const INTERVAL_BETWEEN_REQUESTS = 3000;
export const START_DAY = 3;