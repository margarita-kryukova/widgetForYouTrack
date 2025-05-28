import { MONTHS_IN_YEAR, NUMBER_OF_CHARACTERS } from "../../consts";


export function getMonthRange(minDate: Date, maxDate: Date): string {
  const months: string[] = [];

  // Устанавливаем начальные значения для года и месяца
  let currentYear = minDate.getFullYear();
  let currentMonth = minDate.getMonth();

  while (
    currentYear < maxDate.getFullYear() ||
    (currentYear === maxDate.getFullYear() &&
      currentMonth <= maxDate.getMonth())
  ) {
    // Добавляем текущий месяц в формате YYYY-MM
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(
      NUMBER_OF_CHARACTERS,
      "0"
    )}`;
    months.push(monthStr);

    // Переходим к следующему месяцу
    currentMonth++;
    if (currentMonth > MONTHS_IN_YEAR - 1) {
      currentMonth = 0;
      currentYear++;
    }
  }

  // Преобразуем массив в строку, разделенную запятыми
  return months.join(", ");
}
