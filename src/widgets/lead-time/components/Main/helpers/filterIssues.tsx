/* eslint-disable complexity */
import { IIssueExtendedHours, IValue } from "../../../interfaces";

export function filterIssues(
  issues: IIssueExtendedHours[],
  filters: { [key: string]: string[] }
) {
  return issues.filter((issue) => {
    return Object.keys(filters).every((filterKey) => {
      const selectedValues = filters[filterKey];
      if (selectedValues.includes("all")) {
        // Если выбран "all" — не фильтруем по этому полю, issue всегда подходит
        return true;
      }

      // Одновременно учитываем и null, и остальные значения
      return issue.fields.some((field) => {
        if (field.projectCustomField.field?.id !== filterKey) {
          return false;
        }

        // null-значения
        if (selectedValues.includes("null") && field.value == null) {
          return true;
        }

        // MultiEnum — ищем хотя бы одно совпадение среди массива значений
        if (field.$type === "MultiEnumIssueCustomField") {
          return (
            Array.isArray(field.value) &&
            field.value.some((item) => selectedValues.includes(item.id))
          );
        }

        // Обычный Enum/одиночное значение
        return selectedValues.includes((field.value as IValue)?.id);
      });
    });
  });
}
