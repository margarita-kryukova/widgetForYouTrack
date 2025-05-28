import React, { ReactElement } from "react";
import { IField, IFilters } from "../../interfaces";
import styles from "./index.module.scss";
import FilterItem from "../FilterItem";

interface IFilterListProps {
  filterList: IField[];
  onSelectionChange: (id: string, selected: string[] | null) => void;
  currentFilter: IFilters["fields"];
}

const FilterListComponent: React.FC<IFilterListProps> = ({
  filterList,
  onSelectionChange,
  currentFilter,
}): ReactElement => (
  <form className={styles.filters}>
    <div className={styles.filters__list}>
      {filterList.map((filterItem: IField) => (
        <FilterItem
          item={filterItem}
          key={filterItem.id}
          onSelectionChange={onSelectionChange}
          selectedItems={currentFilter?.[filterItem.field.id]}
        />
      ))}
    </div>
  </form>
);

export default React.memo(FilterListComponent);
