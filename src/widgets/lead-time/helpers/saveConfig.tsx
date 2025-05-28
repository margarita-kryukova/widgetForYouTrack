import { EmbeddableWidgetAPI } from "../../../../@types/globals";
import { DAYS_IN_WEEK, DEFAULT_COUNT_WEEK_FOR_SAVE } from "../consts";
import { IConfig, IIssueExtendedHours } from "../interfaces";
import { readConfigFromHost } from "./readConfigFromHost";

// Универсальная функция для сохранения любой части конфига
async function saveConfig(
  widgetAPI: EmbeddableWidgetAPI,
  changes: object,
  afterSave?: () => void
) {
  try {
    const config = await readConfigFromHost(widgetAPI);
    const newConfig = { ...config, result: {}, ...changes };
    await widgetAPI.storeCache(newConfig);
    await widgetAPI.storeConfig(newConfig);
    afterSave?.();
  } catch (error) {
    // eslint-disable-next-line
    console.error("Ошибка при сохранении конфигурации:", error);
  }
}

export async function saveProjectConfig(
  widgetAPI: EmbeddableWidgetAPI,
  projectName: string,
  projectId: string,
  setIsOpenConfModal: (arg: boolean) => void
) {
  await saveConfig(
    widgetAPI,
    {
      project: { name: projectName, id: projectId }
    },
    () => widgetAPI.exitConfigMode().then(() => setIsOpenConfModal(false))
  );
}

export async function saveFilterConfig(
  widgetAPI: EmbeddableWidgetAPI,
  filtersForSave: IConfig["filters"],
) {
  await saveConfig(widgetAPI, { filters: filtersForSave });
}

export async function saveIssueConfig(
  widgetAPI: EmbeddableWidgetAPI,
  issue: IIssueExtendedHours[]
) {
  const now = new Date();
  const defaultMinDate = new Date(now);
  defaultMinDate.setDate(now.getDate() - DEFAULT_COUNT_WEEK_FOR_SAVE * DAYS_IN_WEEK);
  const issuesForSave = issue.filter((item) => new Date(item.resolved).getTime() > defaultMinDate.getTime());
  await saveConfig(widgetAPI, {
    issueList: {
      list: issuesForSave,
      minDateIssues: defaultMinDate,
      maxDateIssues: new Date(Math.max(...issue.map((item) => item.resolved))),
    },
  });
}
