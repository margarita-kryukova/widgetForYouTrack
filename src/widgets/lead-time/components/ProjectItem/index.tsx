import React, { useCallback } from "react";
import styles from "./index.module.scss";
import { IProjectItem } from "../../interfaces";

interface ProjectItemProps {
  projectItem: IProjectItem;
  callback: (id: string, name: string) => void;
}

const ProjectItemComponent: React.FC<ProjectItemProps> = ({
  projectItem,
  callback,
}) => {
  const handleClick = useCallback(() => {
    callback(projectItem.id, projectItem.name);
  }, [callback, projectItem.id, projectItem.name]);

  return (
    <button type="button" onClick={handleClick} className={styles.item}>
      {projectItem.name}
    </button>
  );
};

export default React.memo(ProjectItemComponent);
