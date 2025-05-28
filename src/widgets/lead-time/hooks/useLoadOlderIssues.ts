/* eslint-disable complexity */
import { useEffect, useRef } from "react";
import { getIssues } from "../features/slice";
import { IWidgetSetup } from "../interfaces";
import { RootState } from "../store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { EmbeddableWidgetAPI } from "../../../../@types/globals";
import { INTERVAL_BETWEEN_REQUESTS } from "../consts";

export function useLoadOlderIssues(
  host: EmbeddableWidgetAPI,
  minDate: Date,
  minRequestedDate: React.MutableRefObject<Date>,
  widgetSetup: IWidgetSetup,
  projects: RootState["data"]["projects"],
  dispatch: ThunkDispatch<RootState, void, AnyAction>
) {
  // Используем ref для отслеживания времени последнего запроса
  const lastRequestTime = useRef(0);

  useEffect(() => {
    // Проверяем, что все необходимые данные доступны
    if (!projects || !widgetSetup?.id || !projects[widgetSetup.id]?.fields) {
      return;
    }

    const now = Date.now();
    
    // Проверяем, прошло ли достаточно времени с последнего запроса (минимум 3 секунды)
    if (lastRequestTime.current !== 0 && now - lastRequestTime.current < INTERVAL_BETWEEN_REQUESTS) {
      return;
    }

    const fields = projects[widgetSetup.id].fields;

    // Загрузка более старых задач (если minDate изменилась)
    if (
      minDate < minRequestedDate.current &&
      (minDate.getMonth() !== minRequestedDate.current.getMonth() ||
        minDate.getFullYear() !== minRequestedDate.current.getFullYear())
    ) {
      // Обновляем время последнего запроса
      lastRequestTime.current = now;
      
      dispatch(
        getIssues({
          host,
          name: widgetSetup.name,
          fields,
          minDate,
          maxDate: minRequestedDate.current,
        })
      ).then(() => {
        minRequestedDate.current = minDate;
      });
    }
  }, [
    minDate,
    widgetSetup?.id,
    widgetSetup?.name,
    dispatch,
    host,
    projects,
  ]);
}
