import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
import { EmbeddableWidgetAPI } from "../../../../../@types/globals";
import { IFilters, IProjectItem } from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import { selectGraphData, updateFilteredIssues, updateSliceData } from "../../features/slice";
import { filterIssues } from "./helpers/filterIssues";
import MainHeader from "../MainHeader";
import MainContent from "../MainContent";
import { saveFilterConfig } from "../../helpers/saveConfig";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import FilterModal from "../FilterModal";
import { getFilterFields } from "./helpers/getFilterFields";

interface Props {
  host: EmbeddableWidgetAPI;
  project: IProjectItem;
  minDate: Date;
  setMinDate: (arg: Date) => void;
  defaultMinDate: Date;
}

const Main: React.FC<Props> = ({
  host,
  project,
  minDate,
  setMinDate,
  defaultMinDate,
}): ReactElement => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  const { issues, filters } = useSelector(selectGraphData);

  const defaultSliceData = useMemo(
    () =>
      project?.fields.find((f) => f.field.id === "77-116")
        ?.id,
    [project?.fields]
  );

  useEffect(() => {
    if (defaultSliceData) {
      dispatch(updateSliceData(filters.sliceData || defaultSliceData))
    }
  }, [defaultSliceData])

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const initialFilters: IFilters = useMemo(() => ({
    fields: {},
    minDate: defaultMinDate,
    maxDate: new Date(),
    group: "week",
    sliceData: defaultSliceData,
    measurement: "hours",
    type: "Discovery",
  }), [defaultMinDate, defaultSliceData]);

  // Восстановление "отфильтрованных" задач при появлении новых issues (но без фильтрации)
  useEffect(() => {
    if (issues.length) {
      dispatch(updateFilteredIssues(issues));
    }
  }, [issues.length]);

  // Синхронизация отфильтрованных задач при изменении issues или фильтров
  useEffect(() => {
    if (issues.length) {
      dispatch(updateFilteredIssues(filterIssues(issues, filters.fields)));
      saveFilterConfig(host, {fields: filters.fields, group: filters.group, sliceData: filters.sliceData, measurement: filters.measurement, type: filters.type});
    }
  }, [issues.length, filters]);

  // Вход в режим конфигурации, если открыт фильтр-модал
  useEffect(() => {
    if (isOpenModal) {
      // eslint-disable-next-line no-console
      host.enterConfigMode().catch(console.error);
    }
  }, [isOpenModal, host]);

  // Обработчики для передачи вниз
  const handleOpenFilters = useCallback(() => setIsOpenModal(true), []);
  const handleCloseFilters = useCallback(() => setIsOpenModal(false), []);

  return (
    <div className={styles.main}>
      {issues.length === 0 && <p>Задач в данном проекте нет</p>}
      {!isOpenModal && issues.length > 0 && (
        <>
          <MainHeader host={host} openFilters={handleOpenFilters} project={project} defaultMinDate={defaultMinDate}/>
          <MainContent project={project} sliceDataId={filters.sliceData}/>
        </>
      )}
      {isOpenModal && (
        <FilterModal
          host={host}
          filterList={getFilterFields(project.fields)}
          callbackModal={handleCloseFilters}
          minDate={minDate}
          setMinDate={setMinDate}
          initialFilters={initialFilters}
        />
      )}
    </div>
  );
};

export default Main;