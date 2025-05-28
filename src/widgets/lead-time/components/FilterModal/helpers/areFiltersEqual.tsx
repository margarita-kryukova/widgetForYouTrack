/* eslint-disable complexity */
import { IFilters } from "../../../interfaces";

function zeroTime(date: Date): Date {
  const formattedDate = new Date(date);
  return new Date(formattedDate.getFullYear(), formattedDate.getMonth(), formattedDate.getDate());
}

export function areFiltersEqual(filter1: IFilters, filter2: IFilters): boolean {
  // Сравниваем даты, игнорируя время
  const minDate1 = zeroTime(filter1.minDate);
  const minDate2 = zeroTime(filter2.minDate);
  const maxDate1 = zeroTime(filter1.maxDate);
  const maxDate2 = zeroTime(filter2.maxDate);

  if (minDate1.getTime() !== minDate2.getTime()) {
    return false;
  }
  if (maxDate1.getTime() !== maxDate2.getTime()) {
    return false;
  }

  // Сравниваем тип графика
  if (filter1.type !== filter2.type) {
    return false;
  }

  // Сравниваем группировку
  if (filter1.group !== filter2.group) {
    return false;
  }

  // Сравниваем единицы измерения
  if (filter1.measurement !== filter2.measurement) {
    return false;
  }

  // Сравниваем разрез графика
  if (filter1.sliceData !== filter2.sliceData) {
    return false;
  }

  // Сравниваем объекты fields
  const keys1 = Object.keys(filter1.fields);
  const keys2 = Object.keys(filter2.fields);

  // Сравниваем количество ключей
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const value1 = filter1.fields[key];
    const value2 = filter2.fields[key];

    // Если значение одно из null, сравниваем на равенство с null
    if (value1 === null && value2 === null) {
      continue;
    }
    if (value1 === null || value2 === null) {
      return false;
    }

    // Сравниваем массивы
    if (value1.length !== value2.length) {
      return false;
    }

    // Проверяем, есть ли элементы в массиве в обоих объектах
    for (let i = 0; i < value1.length; i++) {
      if (value1[i] !== value2[i]) {
        return false;
      }
    }
  }

  return true;
}
