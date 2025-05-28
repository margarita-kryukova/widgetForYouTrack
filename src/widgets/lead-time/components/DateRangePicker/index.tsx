import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { IDateRange, IFilters } from "../../interfaces";
import { parseDate } from "./helpers/parseDate";
import { toInputDate } from "./helpers/toInputDate";

interface IDateRangePickerProps {
  onDateChange: (range: IDateRange) => void;
  filters: IFilters;
}

const DateRangePicker: React.FC<IDateRangePickerProps> = ({
  onDateChange,
  filters,
}) => {
  const [startDate, setStartDate] = useState(() =>
    toInputDate(filters.minDate)
  );
  const [endDate, setEndDate] = useState(() => toInputDate(filters.maxDate));

  // Синхронизируем стейт с внешними изменениями фильтров
  useEffect(() => {
    setStartDate(toInputDate(filters.minDate));
    setEndDate(toInputDate(filters.maxDate));
  }, [filters.minDate, filters.maxDate]);

  // Общий обработчик изменения
  const updateRange = useCallback(
    (newStart: string, newEnd: string) => {
      onDateChange({
        startDate: parseDate(newStart, true),
        endDate: parseDate(newEnd, false),
      });
    },
    [onDateChange]
  );

  // Меняем начальную дату
  const handleStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setStartDate(value);

      const parsedStart = parseDate(value, true);
      const parsedEnd = parseDate(endDate, false);

      // Если начальная дата после конечной — выравниваем их
      if (parsedStart > parsedEnd) {
        setEndDate(value);
        updateRange(value, value);
      } else {
        updateRange(value, endDate);
      }
    },
    [endDate, updateRange]
  );

  // Меняем конечную дату
  const handleEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEndDate(value);
      updateRange(startDate, value);
    },
    [startDate, updateRange]
  );

  return (
    <div className={styles["date-setting"]}>
      <div className={styles["date-setting__range"]}>
        <input type="date" value={startDate} onChange={handleStartChange}/>
        <input
          type="date"
          value={endDate}
          onChange={handleEndChange}
          min={startDate}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
