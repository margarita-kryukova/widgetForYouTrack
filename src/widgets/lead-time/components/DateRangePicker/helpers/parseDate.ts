import {
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  SECONDS_IN_MINUTE,
  START_DAY,
} from "../../../consts";

export const parseDate = (value: string, isStart: boolean) => {
  const hour = isStart ? START_DAY : HOURS_IN_DAY - 1;
  const minute = isStart ? 0 : MINUTES_IN_HOUR - 1;
  const second = isStart ? 0 : SECONDS_IN_MINUTE - 1;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
};
