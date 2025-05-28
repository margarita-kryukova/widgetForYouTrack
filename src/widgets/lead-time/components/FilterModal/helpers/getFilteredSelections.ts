import { IFilters } from "../../../interfaces";

export function getFilteredSelections(selectedOptions: IFilters): IFilters {
  const filteredFields =
    Object.fromEntries(
      Object.entries(selectedOptions.fields)
      .filter(([, v]) => Array.isArray(v) && v.length > 0)
    );
  return {
    fields: filteredFields,
    minDate: selectedOptions.minDate,
    maxDate: selectedOptions.maxDate,
    group: selectedOptions.group,
    sliceData: selectedOptions.sliceData,
    measurement: selectedOptions.measurement,
    type: selectedOptions.type,
  };
}