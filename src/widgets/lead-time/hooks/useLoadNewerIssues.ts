/* eslint-disable complexity */
import { useEffect, useRef } from "react";
import { getIssues } from "../features/slice";
import { IWidgetSetup } from "../interfaces";
import { RootState } from "../store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { EmbeddableWidgetAPI } from "../../../../@types/globals";
import { MILLISECONDS_IN_DAY, NUMBER_OF_CHARACTERS, INTERVAL_BETWEEN_REQUESTS } from "../consts";

export function useLoadNewerIssues(
  host: EmbeddableWidgetAPI,
  maxRequestedDate: React.MutableRefObject<Date>,
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

    const currentTimeMs = Date.now();
    
    // Проверяем, прошло ли достаточно времени с последнего запроса (минимум 3 секунды)
    if (lastRequestTime.current !== 0 && currentTimeMs - lastRequestTime.current < INTERVAL_BETWEEN_REQUESTS) {
      return;
    }

    const now = new Date();
    const fields = projects[widgetSetup.id].fields;

    // Загрузка более новых задач (если прошло достаточно времени с момента последней загрузки)
    if (
      maxRequestedDate.current &&
      Math.abs(maxRequestedDate.current.getTime() - now.getTime()) >
      MILLISECONDS_IN_DAY / NUMBER_OF_CHARACTERS
    ) {
      // Обновляем время последнего запроса
      lastRequestTime.current = currentTimeMs;
      
      dispatch(
        getIssues({
          host,
          name: widgetSetup.name,
          fields,
          minDate: maxRequestedDate.current,
          maxDate: now,
        })
      ).then(() => {
        maxRequestedDate.current = now;
      });
    }
  }, [
    widgetSetup?.id,
    widgetSetup?.name,
    dispatch,
    host,
    projects,
    maxRequestedDate,
  ]);
}
