import React, { ReactElement, useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { TYPE_GRAPH } from "../../consts";

type IFilterTypeGraphProps = {
  onChange: (id: string) => void;
  type: string;
};

const FilterTypeGraph: React.FC<IFilterTypeGraphProps> = ({
  onChange,
  type,
}): ReactElement => {
  const [selectedValue, setSelectedValue] = useState<string>(type);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedValue(type);
  }, [type]);

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

  return (
    <div className={styles.dropdown}>
      <button
        type="button"
        className={styles.dropdown__toggle}
        onClick={toggleDropdown}
      >
        <span className={styles["dropdown__toggle-label"]}>Тип графика:</span>
        <span className={styles["dropdown__toggle-label_variants"]}>
          {selectedValue}
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
          {TYPE_GRAPH.map((item) => (
            <label className={styles.option} key={item}>
              <input
                className={styles.option__checkbox}
                type="radio"
                name="group"
                value={item}
                checked={selectedValue === item}
                onChange={() => handleChange(item)}
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterTypeGraph);
