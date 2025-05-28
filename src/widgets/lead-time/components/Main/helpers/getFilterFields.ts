import { IField } from "../../../interfaces";

export function getFilterFields(fields: IField[]): IField[] {
  const excludedIds = new Set(["77-22", "77-196"]);
  return fields.filter(
    (item) =>
      item.$type === "EnumProjectCustomField" && !excludedIds.has(item.field.id)
  );
}
