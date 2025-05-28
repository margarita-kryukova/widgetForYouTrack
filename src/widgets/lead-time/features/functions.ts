import { EmbeddableWidgetAPI } from "../../../../@types/globals";
import { IActivity, IField, IIssue, IIssueExtendedHours, IIssueWithActivity, IProjectListObj, IValueExtended } from "../interfaces";
import { calculateGlobalStateDurations } from "./helpers/calculateGlobalStateDurations";
import { getMonthRange } from "./helpers/getMonthRange";
import { getTaskHierarchyValues } from "./helpers/getTaskHierarchyValues";

export async function fetchProjects(
  host: EmbeddableWidgetAPI,
  { rejectWithValue }: { rejectWithValue: (error: unknown) => unknown }
) {
  try {
    return await host.fetchYouTrack(
      "admin/projects?fields=id,name,fields(id,value,ordinal,canBeEmpty,emptyFieldText,field(localizedName,name,id,value),bundle(values(ordinal,localizedName,name,id)))&archived=false"
    );
  } catch (err) {
    return rejectWithValue(err);
  }
}

export async function fetchCustomField(
  data: { host: EmbeddableWidgetAPI; id: string },
  { rejectWithValue }: { rejectWithValue: (error: unknown) => unknown }
) {
  try {
    return await data.host.fetchYouTrack(
      `admin/projects/${data.id}/fields?fields=field(fieldType(isMultiValue),id),id`
    );
  } catch (err) {
    return rejectWithValue(err);
  }
}

export function mapFieldsToMultiValueStatus(
  fields: IField[]
): Record<string, boolean> {
  return fields.reduce<Record<string, boolean>>((accumulator, current) => {
    const fieldId = current.field.id;
    const isMultiValue = (current.field as IValueExtended).fieldType
      .isMultiValue;
    accumulator[fieldId] = isMultiValue;
    return accumulator;
  }, {});
}

export function appendIsMultiValue(
  id: string,
  allProjects: IProjectListObj,
  customFieldsObj: { [key: string]: boolean }
) {
  if (allProjects[id] && allProjects[id].fields) {
    allProjects[id].fields.forEach((field) => {
      field.isMultiValue = customFieldsObj[field.field.id];
    });
  }

  return allProjects;
}

export async function fetchIssues(
  data: {
    host: EmbeddableWidgetAPI;
    fields: IField[];
    name: string;
    minDate: Date;
    maxDate: Date;
  },
  { rejectWithValue }: { rejectWithValue: (error: unknown) => unknown }
) {
  try {
    return await getAllIssuesWithActivity(
      data.host,
      data.name,
      getTaskHierarchyValues(data.fields),
      data.minDate,
      data.maxDate,
    );
  } catch (err) {
    return rejectWithValue(err);
  }
}

async function fetchAllIssues(
  host: EmbeddableWidgetAPI,
  projectName: string,
  taskHierarchy: string,
  minDate: Date,
  maxDate: Date
): Promise<IIssue[]> {
  try {
    return await host.fetchYouTrack(
      `issues?fields=id,resolved,created,fields(%40fields),idReadable,summary%3B%40fields%3Avalue(id,minutes,presentation,isEstimation,isSpentTime,name,localizedName,isResolved),id,$type,hasStateMachine,projectCustomField($type,id,field(id,name,ordinal,localizedName,fieldType(id,isBundleType,isMultiValue)),bundle(id,$type),canBeEmpty,emptyFieldText,ordinal)%3B%40value%3Aid,name,autoAttach,attributes(id,timeTrackingSettings(id,project(id)))&query=${encodeURIComponent(
        `project: {${projectName}} ${taskHierarchy} BoardStage: Готово #Завершенная {Дата завершения}: ${getMonthRange(
          minDate,
          maxDate
        )}`
      )}`
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return [];
  }
}

// Получить все задачи с действиями
async function getAllIssuesWithActivity(
  host: EmbeddableWidgetAPI,
  projectName: string,
  taskHierarchy: string,
  minDate: Date,
  maxDate: Date,
): Promise<IIssueExtendedHours[]> {
  const issues = await fetchAllIssues(
    host,
    projectName,
    taskHierarchy,
    minDate,
    maxDate
  );
  if (issues && issues.length > 0) {
    const count: number = 25;
    const issuesWithActivity: IIssueWithActivity[] =
      await processIssuesInBatches(host, issues, count);
    const issuesWithHours: IIssueExtendedHours[] = issuesWithActivity.map((issue) =>
      calculateGlobalStateDurations(issue)
    );
    return issuesWithHours;
  } else {
    return Promise.resolve([]);
  }
}

// Обрабатывать задачи партиями
async function processIssuesInBatches(
  host: EmbeddableWidgetAPI,
  issues: IIssue[],
  batchSize: number
): Promise<IIssueWithActivity[]> {
  let index = 0;
  const results: IIssueWithActivity[] = [];
  while (index < issues.length) {
    const batch = issues.slice(index, index + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (issue) => {
        const activities = (await fetchActivityForIssue(
          host,
          issue.id
        )) as IActivity[];
        return {
          ...issue,
          activitiesGlobalState: [
            ...activities.filter((activity) => activity.field.id === "77-196"),
          ],
        } as IIssueWithActivity;
      })
    );
    results.push(...batchResults);
    index += batchSize;
  }
  return results;
}

async function fetchActivityForIssue(
  host: EmbeddableWidgetAPI,
  issueId: string
) {
  try {
    return await host.fetchYouTrack(
      `issues/${issueId}/activities?categories=CustomFieldCategory&fields=field(id),added(id),removed(id),timestamp`
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    return console.error(err);
  }
}
