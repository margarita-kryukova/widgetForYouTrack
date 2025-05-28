import { PREDEFINED_COLORS } from "../../../consts";
import { IDataForGraph, IDataSets } from "../../../interfaces";
import { getRandomColor } from "./getRandomColor";

export function prepareChartDataFromGraph(dataForGraph: IDataForGraph): [string[], IDataSets] {
    const labels = Object.keys(dataForGraph);
    const uniqueKeys = Object.keys(dataForGraph[labels[0]]?.countMap || {});
    let colorIndex = 0;

    const datasets = uniqueKeys
      .map((key) => {
        const data = labels.map(
          (label) => dataForGraph[label].countMap[key] || 0
        );
        const total = data.reduce((sum, value) => sum + value, 0);

        const backgroundColor =
          PREDEFINED_COLORS[colorIndex % PREDEFINED_COLORS.length] ||
          getRandomColor();

        colorIndex++;

        return total === 0 ? null : { label: key, data, backgroundColor };
      })
      .filter((dataset) => dataset !== null);

    if (datasets.length === 0) {
      datasets.push({
        label: "Нет данных",
        data: Array(labels.length).fill(0),
        backgroundColor: "rgba(200, 200, 200, 0.7)",
      });
    }

    return [labels, datasets];
  }