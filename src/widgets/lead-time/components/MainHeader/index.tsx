import React from "react";
import styles from "./index.module.scss";
import { EmbeddableWidgetAPI } from "../../../../../@types/globals";
import { useDispatch } from "react-redux";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { getIssues, updateData } from "../../features/slice";
import { saveIssueConfig } from "../../helpers/saveConfig";
import { IProjectItem } from "../../interfaces";

interface IMainHeaderProps {
  host: EmbeddableWidgetAPI;
  openFilters: () => void;
  project: IProjectItem;
  defaultMinDate: Date;
}

const MainHeaderComponent: React.FC<IMainHeaderProps> = ({
  host,
  openFilters,
  project,
  defaultMinDate,
}) => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();

  const updateIssues = () => {
    dispatch(updateData());
    saveIssueConfig(host, []);
    dispatch(
      getIssues({
        host,
        fields: project.fields,
        name: project.name,
        minDate: defaultMinDate,
        maxDate: new Date(),
      })
    );
  };
  return (
    <div className={styles.header}>
      <button
        type="button"
        onClick={openFilters}
        className={styles.header__filters}
      >
        Фильтры
      </button>
      <button
        type="button"
        onClick={updateIssues}
        className={styles.header__update}
      >
        Обновить данные{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="m4.257 7.086-.818.819a4.562 4.562 0 0 1 7.05-3.73.625.625 0 1 0 .682-1.047 5.812 5.812 0 0 0-8.982 4.779l-.82-.82a.625.625 0 0 0-.885.883l1.887 1.886c.244.245.64.245.884 0L5.14 7.97a.625.625 0 0 0-.884-.884Zm1.255 4.739a4.562 4.562 0 0 0 7.05-3.73l-.82.818a.625.625 0 1 1-.883-.884l1.886-1.886a.625.625 0 0 1 .884 0l1.886 1.886a.625.625 0 0 1-.883.884l-.82-.82a5.812 5.812 0 0 1-8.983 4.779.625.625 0 0 1 .683-1.047Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default React.memo(MainHeaderComponent);
