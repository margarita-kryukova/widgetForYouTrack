import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { IDateRange, IField, IFilters, IGroup, IMeasurement, ITypeGraph } from "../../interfaces";
import styles from "./index.module.scss";
import FilterList from "../FilterList";
import { EmbeddableWidgetAPI } from "../../../../../@types/globals";
import DateRangePicker from "../DateRangePicker";
import { useDispatch, useSelector } from "react-redux";
import { selectGraphData, updateFilters } from "../../features/slice";
import { areFiltersEqual } from "./helpers/areFiltersEqual";
import { isValidDate } from "./helpers/isValidDate";
import { getFilteredSelections } from "./helpers/getFilteredSelections";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import FilterGroup from "../FilterGroup";
import FilterSliceData from "../FilterSliceData";
import FilterMeasurement from "../FilterMeasurement";
import FilterTypeGraph from "../FilterTypeGraph";

interface IFilterModalProps {
  host: EmbeddableWidgetAPI;
  filterList: IField[];
  callbackModal: (arg: boolean) => void;
  minDate: Date;
  setMinDate: (arg: Date) => void;
  initialFilters: IFilters;
}

const FilterModal: React.FC<IFilterModalProps> = ({
  host,
  filterList,
  callbackModal,
  minDate,
  setMinDate,
  initialFilters,
}): ReactElement => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction>  = useDispatch();
  const { filters } = useSelector(selectGraphData);

  const [selectedOptions, setSelectedOptions] = useState<IFilters>(filters);

  useEffect(() => {
    setSelectedOptions(filters);
  }, [filters]);

  const memoizedFilters = useMemo((): IFilters => ({
    fields: selectedOptions.fields,
    minDate: selectedOptions.minDate,
    maxDate: selectedOptions.maxDate,
    group: selectedOptions.group,
    sliceData: selectedOptions.sliceData,
    measurement: selectedOptions.measurement,
    type: selectedOptions.type,
  }), [selectedOptions]);

  const handleSelectionChange = useCallback(
    (id: string, selected: string[] | null) => {
      setSelectedOptions(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [id]: selected ?? [],
        }
      }));
    },
    []
  );

  const handleChangeDateRange = useCallback(
    (range: IDateRange) => {
      setSelectedOptions(prev => ({
        ...prev,
        minDate: isValidDate(range.startDate) ? range.startDate : minDate,
        maxDate: isValidDate(range.endDate) ? range.endDate : new Date(),
      }));
    },
    [minDate]
  );

  const handleChangeGroup = useCallback(
    (id: IGroup) => {
      setSelectedOptions(prev => ({
        ...prev,
        group: id,
      }));
    },
    []
  );

  const handleChangeType = useCallback(
    (id: ITypeGraph) => {
      setSelectedOptions(prev => ({
        ...prev,
        type: id,
      }));
    },
    []
  );

  const handleChangeSliceData = useCallback(
    (id: string) => {
      setSelectedOptions(prev => ({
        ...prev,
        sliceData: id,
      }));
    },
    []
  );

  const handleChangeMeasurement = useCallback(
    (id: IMeasurement) => {
      setSelectedOptions(prev => ({
        ...prev,
        measurement: id,
      }));
    },
    []
  );

  const handleResetFilter = useCallback(() => {
    setSelectedOptions(initialFilters);
  }, [initialFilters]);

  const handleClickCancel = useCallback(async () => {
    callbackModal(false);
    await host.exitConfigMode();
  }, [host, callbackModal]);

  const isResetDisabled = useMemo(
    () => areFiltersEqual(initialFilters, memoizedFilters),
    [initialFilters, memoizedFilters]
  );

  const handleClickSave = useCallback(async () => {
    const filteredSelections = getFilteredSelections(selectedOptions);
    if (filteredSelections.minDate < minDate) {
      setMinDate(filteredSelections.minDate);
    }
    dispatch(updateFilters(filteredSelections));
    await handleClickCancel();
  }, [selectedOptions, minDate, setMinDate, dispatch, handleClickCancel]);



  return (
    <div className={styles.modal}>
      <DateRangePicker
        onDateChange={handleChangeDateRange}
        filters={memoizedFilters}
      />
      <FilterTypeGraph onChange={handleChangeType} type={memoizedFilters.type}/>
      <FilterGroup onChange={handleChangeGroup} group={memoizedFilters.group}/>
      <FilterMeasurement onChange={handleChangeMeasurement} measurement={memoizedFilters.measurement}/>
      <FilterSliceData filterList={filterList.filter(field => !field.isMultiValue)} onChange={handleChangeSliceData} sliceData={memoizedFilters.sliceData}/>
      <FilterList
        filterList={filterList}
        onSelectionChange={handleSelectionChange}
        currentFilter={memoizedFilters.fields}
      />
      <div className={styles.modal__footer}>
        <button
          type="button"
          className={`${styles.footer__button} ${styles.footer__button_save}`}
          onClick={handleClickSave}
        >
          Применить
        </button>
        <button
          type="button"
          className={`${styles.footer__button} ${styles.footer__button_cancel}`}
          onClick={handleClickCancel}
        >
          Отмена
        </button>
        <button
          type="button"
          className={`${styles.footer__button} ${styles.footer__button_delete}`}
          onClick={handleResetFilter}
          disabled={isResetDisabled}
        >
          Сбросить все фильтры
        </button>
      </div>
    </div>
  );
};

export default React.memo(FilterModal);