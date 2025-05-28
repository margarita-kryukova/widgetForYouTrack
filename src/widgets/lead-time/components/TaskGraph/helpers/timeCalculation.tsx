/* eslint-disable complexity */
import { UNITS_OF_MEASUREMENT } from "../../../consts";
import { IIssueExtendedHours, IMeasurement, ITypeGraph } from "../../../interfaces";

export function timeCalculation(
  issue: IIssueExtendedHours,
  measurement: IMeasurement,
  type: ITypeGraph
): number | undefined {
  const { hours } = issue;
  const unitValue = UNITS_OF_MEASUREMENT[measurement].value;

  if (type === "Discovery" && typeof hours["83-1921"] === "number") {
    return Math.round(hours["83-1921"] / unitValue);
  }

  if (type === "Delivery") {
    const part1 = typeof hours["83-1244"] === "number" ? hours["83-1244"] : 0;
    const part2 = typeof hours["83-1243"] === "number" ? hours["83-1243"] : 0;

    // Если ни одного значения нет — undefined
    if (part1 === 0 && part2 === 0) {return undefined;}

    return Math.round((part1 + part2) / unitValue);
  }

  return undefined;
}