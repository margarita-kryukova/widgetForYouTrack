import {
  IClassMappings,
  IIssueExtendedHours,
  IMeasurement,
  ITypeGraph,
  IValue,
} from "../../../interfaces";
import { calculateMedian } from "./calculateMedian";
import { timeCalculation } from "./timeCalculation";

export function calculateDataForGraph(
  groupsGraph: IIssueExtendedHours[] | Record<string, IIssueExtendedHours[]>,
  classMappings: IClassMappings,
  classFieldId: string,
  measurement: IMeasurement,
  type: ITypeGraph
) {
  const dataForGraph = {};
  for (const columns in groupsGraph) {
    if (groupsGraph.hasOwnProperty(columns)) {
      const issueMap = initializeIssueMap(classMappings);

      groupsGraph[columns].forEach((issue) => {
        updateCountAndIssueMaps(issue, classFieldId, classMappings, issueMap);
      });

      const countMap = calculateMedianValues(issueMap, measurement, type);
      dataForGraph[columns] = { countMap, issueMap };
    }
  }
  return dataForGraph;
}

function calculateMedianValues(
  issuesByClassId: Record<string, IIssueExtendedHours[]>,
  measurement: IMeasurement,
  type: ITypeGraph
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const key in issuesByClassId) {
    if (issuesByClassId.hasOwnProperty(key)) {
      const tasks = issuesByClassId[key];

      const hoursArray = tasks
        .filter((task) => {
          if (type === "Discovery") {
            return typeof task.hours["83-1921"] === "number";
          }
          return (
            typeof task.hours["83-1244"] === "number" ||
            typeof task.hours["83-1243"] === "number"
          );
        })
        .map((task) => timeCalculation(task, measurement, type));
      // Сортируем значения
      hoursArray.sort((a, b) => a - b);

      // Находим медиану
      const median = calculateMedian(hoursArray);
      result[key] = Math.round(median);
    }
  }

  return result;
}

function initializeIssueMap(classMappings: IClassMappings) {
  return Object.keys(classMappings).reduce((map, key) => {
    map[key] = [];
    return map;
  }, {});
}

function updateCountAndIssueMaps(
  issue: IIssueExtendedHours,
  classFieldId: string,
  classMappings: IClassMappings,
  issueMap: { [key: string]: IIssueExtendedHours[] }
) {
  issue.fields.forEach((field) => {
    if (field.id === classFieldId) {
      const valueName =
        field.value && (field.value as IValue).name
          ? (field.value as IValue).name
          : "(Пусто)";
      if (classMappings.hasOwnProperty(valueName)) {
        issueMap[valueName].push(issue);
      }
    }
  });
}
