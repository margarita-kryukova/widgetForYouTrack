import React from "react";
import styles from "./index.module.scss";
import { IIssueExtendedHours } from "../../interfaces";
import { timeCalculation } from "../TaskGraph/helpers/timeCalculation";
import { useSelector } from "react-redux";
import { selectGraphData } from "../../features/slice";
import { UNITS_OF_MEASUREMENT } from "../../consts";

function TaskList({
  list,
  callback,
}: {
  list: {
    title: string;
    issues: { [key: string]: IIssueExtendedHours[] };
  };
  callback: (arg: null) => void;
}) {
  const keys = Object.keys(list.issues);
  const { filters } = useSelector(selectGraphData);
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{list.title}</h2>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className={styles["btn-close"]}
        color="currentColor"
        onClick={() => callback(null)}
      >
        <path d="M13.63 3.65l-1.28-1.27L8 6.73 3.64 2.38 2.37 3.65l4.35 4.36-4.34 4.34 1.27 1.28L8 9.28l4.35 4.36 1.28-1.28-4.36-4.35 4.36-4.36z"/>
      </svg>
      {keys.map((key) => {
        if (list.issues[key].length > 0) {
          return (
            <>
              <h3 key={key} className={styles.subtitle}>
                {key}
              </h3>
              <ul className={styles.list}>
                {list.issues[key].map((item) => {
                  const time = timeCalculation(item, filters.measurement, filters.type);
                  const unit = UNITS_OF_MEASUREMENT[filters.measurement].name;
                  return (
                    <li key={item.id} className={styles.list__item}>
                      <a
                        href={`https://youtrack.hpdd.ru/issue/${item.idReadable}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.idReadable}
                        {time !== undefined && ` (${unit}: ${time})`}:{" "}
                        {item.summary}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          );
        }
        return null;
      })}
    </div>
  );
}

export default TaskList;
