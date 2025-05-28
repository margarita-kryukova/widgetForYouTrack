/* eslint-disable complexity */
import { useEffect, useRef } from "react";
import { getIssues, updateIssues } from "../features/slice";
import { IConfig, IWidgetSetup } from "../interfaces";
import { RootState } from "../store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { EmbeddableWidgetAPI } from "../../../../@types/globals";

export function useSyncIssuesFromConfig(
  host: EmbeddableWidgetAPI,
  dispatch: ThunkDispatch<RootState, void, AnyAction>,
  widgetSetup: IWidgetSetup,
  configIssues: IConfig["issueList"] | undefined,
  projects: RootState["data"]["projects"],
  minRequestedDate: React.MutableRefObject<Date>,
  maxRequestedDate: React.MutableRefObject<Date>
) {
  // Используем ref для отслеживания предыдущих значений и предотвращения лишних срабатываний
  const prevWidgetId = useRef<string | null>(null);
  const prevConfigIssuesLength = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Проверяем, что все необходимые данные доступны
    if (!widgetSetup?.id || !widgetSetup.name) {
      return;
    }

    // Проверяем, изменился ли ID виджета
    const widgetIdChanged = prevWidgetId.current !== widgetSetup.id;
    if (widgetIdChanged) {
      prevWidgetId.current = widgetSetup.id;
    }

    // Проверяем, изменилось ли количество задач в конфигурации
    const currentConfigIssuesLength = configIssues?.list?.length || 0;
    const configIssuesLengthChanged = prevConfigIssuesLength.current !== currentConfigIssuesLength;
    if (configIssuesLengthChanged) {
      prevConfigIssuesLength.current = currentConfigIssuesLength;
    }

    // Если это первая загрузка или изменился ID виджета или количество задач в конфигурации
    if (isInitialLoad.current || widgetIdChanged || configIssuesLengthChanged) {
      isInitialLoad.current = false;

      // Если нет задач в конфигурации, загружаем их
      if (!configIssues?.list?.length) {
        // Проверяем, что поля проекта доступны
        if (!projects[widgetSetup.id]?.fields) {
          return;
        }

        dispatch(
          getIssues({
            host,
            fields: projects[widgetSetup.id].fields,
            name: widgetSetup.name,
            minDate: minRequestedDate.current,
            maxDate: new Date(),
          })
        );
      } 
      // Если есть задачи в конфигурации, обновляем состояние
      else if (configIssues?.list?.length) {
        dispatch(updateIssues(configIssues.list));
        minRequestedDate.current = configIssues.minDateIssues;
        maxRequestedDate.current = configIssues.maxDateIssues;
      }
    }
  }, [
    widgetSetup?.id, 
    widgetSetup?.name, 
    configIssues, 
    projects,
    dispatch,
    host,
    minRequestedDate,
    maxRequestedDate
  ]);
}