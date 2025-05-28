import { IProjectItem } from "../../../interfaces";

export function extractDataSliceIds(project: IProjectItem, idField: string) {
  const result = {};

  project.fields.forEach((field) => {
    // Находим поле, по которому будет разрез
    if (field.id === idField) {
      // Устанавливаем ключ первого уровня как field.id
      const fieldId = field.id;
      result[fieldId] = {};

      // Создаем пары ключ-значение с именами и ID's из field.bundle.values
      field.bundle.values.forEach((value) => {
        const name = value.name;
        result[fieldId][name] = value.id;
      });

      // Проверяем, если объект result[fieldId] не пустой, добавляем элемент "(Пусто)": null
      if (Object.keys(result[fieldId]).length > 0) {
        result[fieldId]["(Пусто)"] = null;
      }
    }
  });
  return result;
}
