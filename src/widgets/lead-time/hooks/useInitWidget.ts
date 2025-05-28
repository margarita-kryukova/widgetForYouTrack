/* eslint-disable complexity */
import { useCallback } from "react";
import {
  getProjects,
  getCustomField,
  updateFiltersFields,
  updateGroup,
  updateSliceData,
  updateMeasurement,
  updateTypeGraph,
} from "../features/slice";
import { readConfigFromHost } from "../helpers/readConfigFromHost";
import { RootState } from "../store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { IConfig, IWidgetSetup } from "../interfaces";
import { EmbeddableWidgetAPI } from "../../../../@types/globals";

export function useInitWidget(
  host: EmbeddableWidgetAPI,
  dispatch: ThunkDispatch<RootState, void, AnyAction>,
  setWidgetSetup: React.Dispatch<React.SetStateAction<IWidgetSetup>>,
  setConfigIssues: React.Dispatch<
    React.SetStateAction<IConfig["issueList"] | undefined>
  >,
  setIsOpenConfModal: React.Dispatch<React.SetStateAction<boolean>>,
  minRequestedDate: React.MutableRefObject<Date>,
  maxRequestedDate: React.MutableRefObject<Date>
) {
  return useCallback(async () => {
    try {
      await dispatch(getProjects(host));
      const config = await readConfigFromHost(host);

      if (config?.issueList) {
        setConfigIssues(config.issueList);
        minRequestedDate.current = config.issueList.minDateIssues;
        maxRequestedDate.current = config.issueList.maxDateIssues;
      }

      if (config?.filters) {
        if (config.filters.fields) {
          dispatch(updateFiltersFields(config.filters.fields));
        }
        if (config.filters.group) {
          dispatch(updateGroup(config.filters.group));
        }
        if (config.filters.type) {
          dispatch(updateTypeGraph(config.filters.type));
        }
        if (config.filters.sliceData) {
          dispatch(updateSliceData(config.filters.sliceData));
        }
        if (config.filters.measurement) {
          dispatch(updateMeasurement(config.filters.measurement));
        }
      }

      if (config?.project?.name && config?.project?.id) {
        setWidgetSetup({ id: config.project.id, name: config.project.name });
        host.setTitle(`Lead time: ${config.project.name}`, "");
        dispatch(getCustomField({ host, id: config.project.id }));
        setIsOpenConfModal(false);
        await host.exitConfigMode();
      } else {
        await host.enterConfigMode();
        setIsOpenConfModal(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Ошибка при загрузке конфигурации:", error);
    }
  }, [host, dispatch, setWidgetSetup, setConfigIssues, setIsOpenConfModal]);
}
