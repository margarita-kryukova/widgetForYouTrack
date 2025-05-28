import React, { ReactElement, useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { GROUP_LIST } from "../../consts";

type IFilterGroupProps = {
  onChange: (id: string) => void;
  group: string;
};

const FilterGroup: React.FC<IFilterGroupProps> = ({
  onChange,
  group,
}): ReactElement => {
  const [selectedValue, setSelectedValue] = useState<string>(group);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedValue(group);
  }, [group]);

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

  const groups = Object.keys(GROUP_LIST);

  return (
    <div className={styles.dropdown}>
      <button
        type="button"
        className={styles.dropdown__toggle}
        onClick={toggleDropdown}
      >
        <span className={styles["dropdown__toggle-label"]}>Группировать по:</span>
        <span className={styles["dropdown__toggle-label_variants"]}>
          {GROUP_LIST[selectedValue]}
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
          {groups.map((key) => (
            <label className={styles.option} key={key}>
              <input
                className={styles.option__checkbox}
                type="radio"
                name="group"
                value={GROUP_LIST[key]}
                checked={selectedValue === key}
                onChange={() => handleChange(key)}
              />
              {GROUP_LIST[key]}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterGroup);
