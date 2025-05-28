import React, { useCallback } from "react";
import { IValue } from "../../interfaces";
import styles from "./index.module.scss";

interface IFilterItemOptionProps {
  item: IValue;
  parent: string;
  isCheckedItem: boolean;
  onChange: (id: string, isChecked: boolean) => void;
}

const FilterItemOptionComponent: React.FC<IFilterItemOptionProps> = ({
  item,
  parent,
  isCheckedItem,
  onChange,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(item.id, e.target.checked);
    },
    [onChange, item.id]
  );

  return (
    <label className={styles.option}>
      <input
        className={styles.option__checkbox}
        type="checkbox"
        value={item.id}
        name={parent}
        checked={isCheckedItem}
        onChange={handleChange}
      />
      {item.localizedName || item.name}
    </label>
  );
};
export default React.memo(FilterItemOptionComponent);
