import React, { useMemo } from "react";
import { IProjectItem } from "../../interfaces";
import { useSelector } from "react-redux";
import { selectGraphData } from "../../features/slice";
import TaskGraph from "../TaskGraph";
import { extractDataSliceIds } from "./helpers/extractDataSliceIds";

interface IMainContentProps {
  project: IProjectItem;
  sliceDataId?: string;
}

const MainContent: React.FC<IMainContentProps> = ({ project, sliceDataId }) => {
  const { filteredIssues } = useSelector(selectGraphData);

  const classId = useMemo(() => extractDataSliceIds(project, sliceDataId), [project, sliceDataId]);

  if (!filteredIssues.length) {
    return <p>Задач с заданными фильтрами нет</p>;
  }


  return <TaskGraph classId={classId}/>;
};

export default React.memo(MainContent);