import { IIssueExtendedHours } from "../../interfaces";

export function removeDuplicatesById(
  arr: IIssueExtendedHours[]
): IIssueExtendedHours[] {
  const map = new Map<string, IIssueExtendedHours>(); // Используем Map для хранения уникальных объектов

  for (const item of arr) {
    map.set(item.id, item); // В Map сохраняются только уникальные id (последнее записанное значение)
  }

  return Array.from(map.values()); // Преобразуем значения Map обратно в массив
}
