import React, { ReactElement, useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IField } from "../../interfaces";

type IFilterSliceDataProps = {
  filterList: IField[];
  onChange: (id: string) => void;
  sliceData: string;
};

const FilterSliceData: React.FC<IFilterSliceDataProps> = ({
  filterList,
  onChange,
  sliceData,
}): ReactElement => {
  const [selectedValue, setSelectedValue] = useState<string>(sliceData);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedValue(sliceData);
  }, [sliceData]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleChange = useCallback(
    (value: string) => {
      if (value !== selectedValue) {
        setSelectedValue(value);
        onChange(value);
      }
    },
    [onChange, selectedValue]
  );

  const selected = filterList.filter((item) => item.id === selectedValue);

  return (
    <div className={styles.dropdown}>
      <button
        type="button"
        className={styles.dropdown__toggle}
        onClick={toggleDropdown}
      >
        <span className={styles["dropdown__toggle-label"]}>Разрез по:</span>
        <span className={styles["dropdown__toggle-label_variants"]}>
          {selected[0]?.field.localizedName || selected[0]?.field.name}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={styles["dropdown__toggle-icon"]}
          color="currentColor"
        >
          <path d="M5 7.99L1.5 4.5l1-1L5 6.01 7.5 3.5l.99 1L5 7.99z"/>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.dropdown__menu}>
          {filterList.map((filter) => (
            <label className={styles.option} key={filter.id}>
              <input
                className={styles.option__checkbox}
                type="radio"
                name="sliceData"
                value={filter.id}
                checked={selectedValue === filter.id}
                onChange={() => handleChange(filter.id)}
              />
              {filter.field.localizedName || filter.field.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterSliceData);
