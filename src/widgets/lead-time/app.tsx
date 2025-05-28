import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { EmbeddableWidgetAPI } from "../../../@types/globals";
import { RootState } from "./store";
import styles from "./index.module.scss";
import Loader from "./components/Loader";
import WidgetSetup from "./components/WidgetSetup";
import Main from "./components/Main";
import { DAYS_IN_WEEK, DEFAULT_COUNT_WEEK } from "./consts";
import { IConfig, IWidgetSetup } from "./interfaces";
import { saveProjectConfig } from "./helpers/saveConfig";
import { selectGraphData } from "./features/slice";
import { useInitWidget } from "./hooks/useInitWidget";
import { useSyncIssuesFromConfig } from "./hooks/useSyncIssuesFromConfig";
import { useSaveIssuesConfigOnChange } from "./hooks/useSaveIssuesConfigOnChange";
import { useLoadOlderIssues } from "./hooks/useLoadOlderIssues";
import { useUpdateMinDate } from "./hooks/useUpdateMinDate";
import { useResetLoadingState } from "./hooks/useResetLoadingState";
import { useLoadNewerIssues } from "./hooks/useLoadNewerIssues";

// Регистрация host
const host = (await YTApp.register()) as EmbeddableWidgetAPI;

const AppComponent: React.FC = () => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  const { projects, isLoading, issues, activeRequests } = useSelector(selectGraphData);

  const [isOpenConfModal, setIsOpenConfModal] = useState(true);
  const [widgetSetup, setWidgetSetup] = useState<IWidgetSetup>({
    id: "",
    name: "",
  });
  const [configIssues, setConfigIssues] = useState<IConfig["issueList"]>();

  // Даты
  const now = new Date();
  const defaultMinDate = new Date(now);
  defaultMinDate.setDate(now.getDate() - DEFAULT_COUNT_WEEK * DAYS_IN_WEEK);
  const minRequestedDate = useRef(defaultMinDate);
  const maxRequestedDate = useRef(null);
  const [minDate, setMinDate] = useState<Date>(minRequestedDate.current);

  // Инициализация виджета
  const initializeWidget = useInitWidget(
    host,
    dispatch,
    setWidgetSetup,
    setConfigIssues,
    setIsOpenConfModal,
    minRequestedDate,
    maxRequestedDate,
  );
  useEffect(() => {
    initializeWidget();
  }, [initializeWidget]);

  useSyncIssuesFromConfig(
    host,
    dispatch,
    widgetSetup,
    configIssues,
    projects,
    minRequestedDate,
    maxRequestedDate,
  );
  useSaveIssuesConfigOnChange(host, issues);
  useLoadOlderIssues(
    host,
    minDate,
    minRequestedDate,
    widgetSetup,
    projects,
    dispatch
  );
  useLoadNewerIssues(
    host,
    maxRequestedDate,
    widgetSetup,
    projects,
    dispatch
  );
  useUpdateMinDate(minDate, dispatch);
  useResetLoadingState(dispatch, isLoading, activeRequests);

  // Обработчик выбора проекта
  const projectSelectionHandler = useCallback(
    async (id: string, name: string) => {
      setWidgetSetup({ id, name });
      saveProjectConfig(host, name, id, setIsOpenConfModal);
      await host.exitConfigMode();
    },
    []
  );

  return (
    <div className={styles.widget}>
      {isOpenConfModal ? (
        <WidgetSetup callback={projectSelectionHandler} host={host}/>
      ) : (
        <div className={styles.content}>
          {isLoading || !projects[widgetSetup.id] ? (
            <Loader/>
          ) : (
            <Main
              host={host}
              project={projects[widgetSetup.id]}
              minDate={minDate}
              setMinDate={setMinDate}
              defaultMinDate={defaultMinDate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const App = memo(AppComponent);
