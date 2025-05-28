import {
  DAYS_IN_WEEK,
  MONTHS_IN_QUARTER,
  NUMBER_OF_CHARACTERS,
} from "../../../consts";
import { IIssueExtendedHours } from "../../../interfaces";

export function formatIssuesByPeriod(
  issues: IIssueExtendedHours[],
  period: string,
  start: Date,
  finish: Date
) {
  switch (period) {
    case "week":
      return groupByWeek(issues, start, finish);
    case "month":
      return groupByMonth(issues, start, finish);
    case "quarter":
      return groupByQuarter(issues, start, finish);
    case "year":
      return groupByYear(issues, start, finish);
    default:
      return issues;
  }
}

function groupByYear(
  issues: IIssueExtendedHours[],
  start: Date,
  finish: Date
): Record<string, IIssueExtendedHours[]> {
  // Получаем все годы в заданном диапазоне
  const allYears = getAllYears(start, finish);

  // Заполнение результирующего объекта, включая годы без задач
  return allYears.reduce(
    (acc: Record<string, IIssueExtendedHours[]>, yearKey: string) => {
      acc[yearKey] = issues.filter((item) => {
        const date = new Date(item.resolved);
        const year = date.getFullYear();
        return year.toString() === yearKey;
      });
      return acc;
    },
    {}
  );
}

function getAllYears(start: Date, finish: Date) {
  const years: string[] = [];
  const formattedStart = new Date(start);
  const formattedFibish = new Date(finish);
  let current = formattedStart.getFullYear();

  while (current <= formattedFibish.getFullYear()) {
    years.push(current.toString());
    current += 1;
  }

  return years;
}

function groupByQuarter(
  issues: IIssueExtendedHours[],
  start: Date,
  finish: Date
): Record<string, IIssueExtendedHours[]> {
  // Получаем все кварталы в заданном диапазоне
  const allQuarters = getAllQuarters(start, finish);

  // Заполнение результирующего объекта, включая кварталы без задач
  return allQuarters.reduce(
    (acc: Record<string, IIssueExtendedHours[]>, quarterKey: string) => {
      acc[quarterKey] = issues.filter((item: IIssueExtendedHours) => {
        const date = new Date(item.resolved);
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / MONTHS_IN_QUARTER) + 1;
        const formattedQuarter = `Q${quarter}-${year}`;

        return formattedQuarter === quarterKey;
      });
      return acc;
    },
    {}
  );
}

function getAllQuarters(start: Date, finish: Date): string[] {
  const quarters: string[] = [];
  const formattedStart = new Date(start);
  const formattedFibish = new Date(finish);
  const current = new Date(formattedStart.getFullYear(), formattedStart.getMonth(), 1);

  while (current <= formattedFibish) {
    const year: number = current.getFullYear();
    const quarter: number =
      Math.floor(current.getMonth() / MONTHS_IN_QUARTER) + 1;
    const quarterKey: string = `Q${quarter}-${year}`;

    if (!quarters.includes(quarterKey)) {
      quarters.push(quarterKey);
    }

    // Перемещаемся на следующий квартал
    current.setMonth(current.getMonth() + MONTHS_IN_QUARTER);
  }

  return quarters;
}

function groupByMonth(
  issues: IIssueExtendedHours[],
  start: Date,
  finish: Date
): Record<string, IIssueExtendedHours[]> {
  // Получаем все месяца в заданном диапазоне
  const allMonths = getAllMonths(start, finish);

  // Заполнение результирующего объекта, включая месяцы без задач
  return allMonths.reduce((acc: Record<string, IIssueExtendedHours[]>, monthKey) => {
    acc[monthKey] = issues.filter((item) => {
      const date = new Date(item.resolved);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1)
        .toString()
        .padStart(NUMBER_OF_CHARACTERS, "0");
      const formattedMonth = `${month}-${year}`;

      return formattedMonth === monthKey;
    });
    return acc;
  }, {});
}

function getAllMonths(start: Date, finish: Date): string[] {
  const months: string[] = [];
  const formattedStart = new Date(start);
  const formattedFibish = new Date(finish);
  const current = new Date(formattedStart.getFullYear(), formattedStart.getMonth(), 1);

  while (current <= formattedFibish) {
    const year = current.getFullYear();
    const month = (current.getMonth() + 1)
      .toString()
      .padStart(NUMBER_OF_CHARACTERS, "0");
    const monthKey = `${month}-${year}`;

    if (!months.includes(monthKey)) {
      months.push(monthKey);
    }

    // Перемещаемся на следующий месяц
    current.setMonth(current.getMonth() + 1);
  }

  return months;
}

function groupByWeek(
  issues: IIssueExtendedHours[],
  start: Date,
  finish: Date
): Record<string, IIssueExtendedHours[]> {
  // Получаем все недели в заданном диапазоне
  const allWeeks = getAllWeeks(start, finish);

  // Заполнение результирующего объекта, включая недели без задач
  return allWeeks.reduce(
    (acc: Record<string, IIssueExtendedHours[]>, weekDetails) => {
      const { range } = weekDetails; // Извлекаем только временной период
      acc[range] = issues.filter((item) => {
        const date = new Date(item.resolved);

        // Получаем начало и конец недели для даты задачи
        const startOfWeek = new Date(date);
        startOfWeek.setDate(
          date.getDate()-(date.getDay() || DAYS_IN_WEEK) + 1
        );
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + DAYS_IN_WEEK - 1);

        // Формируем строку диапазона для сравнения
        const currentRange = `${formatDate(startOfWeek)}-${formatDate(
          endOfWeek
        )}`;

        return currentRange === range;
      });
      return acc;
    },
    {}
  );
}

function getAllWeeks(start: Date, finish: Date): { range: string }[] {
  const weeks: { range: string }[] = [];
  let current = new Date(start);
  
  while (current <= new Date(finish)) {
      const startOfWeek = new Date(current);
      startOfWeek.setDate(startOfWeek.getDate()-(startOfWeek.getDay() || DAYS_IN_WEEK) + 1); // Понедельник
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + DAYS_IN_WEEK - 1); // Воскресенье
  
      const range = `${formatDate(startOfWeek)}-${formatDate(endOfWeek)}`;
      weeks.push({ range });
  
      // Продвигаемся на 1 неделю вперед
      current = new Date(startOfWeek);
      current.setDate(current.getDate() + DAYS_IN_WEEK);
  }
  
  return weeks;
  }

function formatDate(date: Date): string {
  const formattedDate = new Date(date);
  // eslint-disable-next-line no-magic-numbers
  const year = formattedDate.getFullYear().toString().slice(-2);
  const month = String(formattedDate.getMonth() + 1).padStart(NUMBER_OF_CHARACTERS, "0");
  const day = String(formattedDate.getDate()).padStart(NUMBER_OF_CHARACTERS, "0");
  return `${day}.${month}.${year}`;
}