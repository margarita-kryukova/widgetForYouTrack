import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectGraphData } from "../../features/slice";
import { Bar } from "react-chartjs-2";
import { IDataForGraph, IIssueExtendedHours } from "../../interfaces";
import {
  ChartOptions,
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  SubTitle,
} from "chart.js";
import styles from "./index.module.scss";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Импортируем плагин
import { formatIssuesByPeriod } from "./helpers/formatIssuesByPeriod";
import { calculateDataForGraph } from "./helpers/calculateDataForGraph";
import { prepareChartDataFromGraph } from "./helpers/prepareChartDataFromGraph";
import TaskList from "../TaskList";
import { UNITS_OF_MEASUREMENT } from "../../consts";

// Регистрируем необходимые масштабы и элементы
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface TaskGraphProps {
  classId: {
    [key: string]: { [keyItem: string]: string | null };
  };
}

const TaskGraph: React.FC<TaskGraphProps> = ({ classId }) => {
  const { filteredIssues, filters } = useSelector(selectGraphData);
  const [chartData, setChartData] = useState(null);
  const [dataForClick, setDataForClick] = useState<
    Record<
      number,
      { title: string; issues: Record<string, IIssueExtendedHours[]> }
    >
  >({});
  const [currentActiveColumn, setCurrentActiveColumn] = useState<{
    title: string;
    issues: Record<string, IIssueExtendedHours[]>;
  } | null>(null);

  const chartOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      interaction: { intersect: false, mode: "index" },
      plugins: {
        title: {
          display: true,
          text: `Lead time (${filters.type})`,
          font: { size: 20, weight: "bold" },
          color: "black",
        },
        subtitle: {
          display: true,
          text: `Медианное время (${UNITS_OF_MEASUREMENT[filters.measurement].name.toLowerCase()}) движения фичи`,
          font: { size: 16 },
          color: "black",
        },
        datalabels: {
          display: filters.group !== "week", // Включаем отображение значений
          anchor: "end",
          align: "end",
          formatter: (value: number) => value.toString(), // Форматирование значения
          font: {
            weight: "normal",
            size: 8,
            color: "black",
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw;
              return `${tooltipItem.dataset.label}: ${value}`;
            },
          },
        },
      },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          stacked: false,
          title: {
            display: true,
            color: "black",
            font: { size: 20, weight: "normal", lineHeight: 1.2 },
            padding: { top: 0 },
          },
        },
        y: {
          stacked: false,
        },
      },
      onClick: (_, elements) => {
        if (elements.length > 0) {
          setCurrentActiveColumn(dataForClick[elements[0].index]);
        }
      },
    }),
    [dataForClick]
  );

  useEffect(() => {
    const groups = formatIssuesByPeriod(
      filteredIssues,
      filters.group,
      filters.minDate,
      filters.maxDate
    );
    const [fieldId] = Object.keys(classId);
    const mappings = fieldId ? classId[fieldId] : {};
    const dataForGraph: IDataForGraph = fieldId
      ? calculateDataForGraph(groups, mappings, fieldId, filters.measurement, filters.type)
      : Object.fromEntries(
          Object.entries(groups).map(([k, v]) => [
            k,
            {
              countMap: { "Total Tasks": v.length },
              issueMap: { "Total Tasks": v },
            },
          ])
      );

    const transformed = Object.entries(dataForGraph).reduce(
      (acc, [title, { issueMap }], i) => {
        acc[i] = { title, issues: issueMap };
        return acc;
      },
      {} as typeof dataForClick
    );

    setDataForClick(transformed);
    const [labels, datasets] = prepareChartDataFromGraph(dataForGraph);
    setChartData({
      labels,
      datasets: datasets,
    });
  }, [filteredIssues, filters.group]);

  return (
    <>
      <div
        className={`${styles["graph-wrapper"]} ${
          currentActiveColumn ? styles["graph-wrapper_min"] : ""
        }`}
      >
        <div className={styles.graph}>
          {chartData ? (
            <Bar data={chartData} options={chartOptions}/>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
      {currentActiveColumn && (
        <TaskList
          list={currentActiveColumn}
          callback={setCurrentActiveColumn}
        />
      )}
    </>
  );
};

export default TaskGraph;
