import React, { ReactElement, useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { UNITS_OF_MEASUREMENT } from "../../consts";

type IFilterMeasurementProps = {
  onChange: (id: string) => void;
  measurement: string;
};

const FilterMeasurement: React.FC<IFilterMeasurementProps> = ({
  onChange,
  measurement,
}): ReactElement => {
  const [selectedValue, setSelectedValue] = useState<string>(measurement);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSelectedValue(measurement);
  }, [measurement]);

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

  const measurements = Object.keys(UNITS_OF_MEASUREMENT);

  return (
    <div className={styles.dropdown}>
      <button
        type="button"
        className={styles.dropdown__toggle}
        onClick={toggleDropdown}
      >
        <span className={styles["dropdown__toggle-label"]}>Единицы измерения:</span>
        <span className={styles["dropdown__toggle-label_variants"]}>
          {UNITS_OF_MEASUREMENT[selectedValue].name}
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
          {measurements.map((key) => (
            <label className={styles.option} key={key}>
              <input
                className={styles.option__checkbox}
                type="radio"
                name="measurement"
                value={UNITS_OF_MEASUREMENT[key].name}
                checked={selectedValue === key}
                onChange={() => handleChange(key)}
              />
              {UNITS_OF_MEASUREMENT[key].name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterMeasurement);
