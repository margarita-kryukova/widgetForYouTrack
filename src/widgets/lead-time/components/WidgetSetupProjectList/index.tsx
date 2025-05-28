import React, { useMemo } from "react";
import styles from "./index.module.scss";
import ProjectItem from "../ProjectItem";
import { IProjectListObj } from "../../interfaces";

interface IWidgetSetupProjectListProps {
  projectsList: IProjectListObj;
  callback: (id: string, name: string) => void;
}

const WidgetSetupProjectListComponent: React.FC<
  IWidgetSetupProjectListProps
> = ({ projectsList, callback }) => {
  const projectIds = useMemo(() => Object.keys(projectsList), [projectsList]);

  return (
    <div className={styles.projects}>
      <h2 className={styles.projects__title}>Выберите проект</h2>
      <p className={styles.projects__desc}>
        (Доступны только проекты, содержащие поля &laquo;BoardStage&raquo;
        и&nbsp;&laquo;Класс обслуживания&raquo;)
      </p>
      <div className={styles.projects__list}>
        {projectIds.map((id) => (
          <ProjectItem
            projectItem={projectsList[id]}
            key={projectsList[id].id}
            callback={callback}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(WidgetSetupProjectListComponent);
