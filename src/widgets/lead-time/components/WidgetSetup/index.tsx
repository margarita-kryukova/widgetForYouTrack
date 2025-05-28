import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomField, selectGraphData } from "../../features/slice";
import WidgetSetupProjectList from "../WidgetSetupProjectList";
import { EmbeddableWidgetAPI } from "../../../../../@types/globals";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface IWidgetSetupProps {
  callback: (id: string, name: string) => void;
  host: EmbeddableWidgetAPI;
}

const WidgetSetupComponent: React.FC<IWidgetSetupProps> = ({
  callback,
  host,
}) => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  const { projects } = useSelector(selectGraphData);

  const handleProjectSelection = useCallback(
    (id: string, name: string) => {
      host.setTitle(`Lead time: ${name}`, "");
      dispatch(getCustomField({ host, id }));
      callback(id, name);
    },
    [host, dispatch, callback]
  );

  return (
    <WidgetSetupProjectList
      projectsList={projects}
      callback={handleProjectSelection}
    />
  );
};

export default React.memo(WidgetSetupComponent);
