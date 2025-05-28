import { TASK_HIERARCHY_FILTER_FIELDS } from "../../consts";
import { IField } from "../../interfaces";

export function getTaskHierarchyValues(array: IField[]): string {
  const boardStageField = array.find(field => field.field.id === "77-22");

  if (!boardStageField) {
    // eslint-disable-next-line no-console
    console.warn('Field with id "77-22" not found');
    return "";
  }

  const stageNames: string[] = (boardStageField.bundle?.values ?? []).map(v => v.name);

  const result = stageNames
    .filter(name => name in TASK_HIERARCHY_FILTER_FIELDS)
    .map(name => TASK_HIERARCHY_FILTER_FIELDS[name as keyof typeof TASK_HIERARCHY_FILTER_FIELDS]);

  return result.join(" ");
}