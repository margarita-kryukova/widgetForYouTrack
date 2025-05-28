/* eslint-disable complexity */
import React, {
  ReactElement,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { IField } from "../../interfaces";
import styles from "./index.module.scss";
import FilterItemOption from "../FilterItemOption";
import { transformBundleValues } from "./helpers/transformBundleValues";

interface IFilterItemProps {
  item: IField;
  selectedItems: string[] | null;
  onSelectionChange: (id: string, selected: string[] | null) => void;
};

const FilterItem: React.FC<IFilterItemProps> = ({
  item,
  selectedItems,
  onSelectionChange,
}): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const optionsObj = useMemo(() => transformBundleValues(item), [item]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(
    () => new Set(selectedItems ?? [])
  );

  useEffect(() => {
    setCheckedItems(new Set(selectedItems ?? []));
  }, [selectedItems]);

  const checkedStr = useMemo(() => {
    return Array.from(checkedItems)
      .map((id) => (id === "null" ? "(Пусто)" : optionsObj[id]))
      .filter(Boolean)
      .join(", ");
  }, [checkedItems, optionsObj]);

  // Открытие/закрытие дропдауна
  const toggleDropdown = useCallback(() => setIsOpen(v => !v), []);

  // Выбрать/снять "всё"
  const handleSelectAll = useCallback(
    (newCheckedItems: Set<string>, select: boolean) => {
      newCheckedItems.clear();
      if (select) {
        item.bundle?.values.forEach((value) => {
          newCheckedItems.add(value.id);
        });
        newCheckedItems.add("null");
        newCheckedItems.add("all");
      }
    },
    [item.bundle?.values]
  );

  // Отмечать "all", если выбраны все остальные поля
  const updateAllSelectionState = useCallback(
    (newCheckedItems: Set<string>) => {
      const allSelected =
        item.bundle?.values.length &&
        item.bundle.values.every((value) => newCheckedItems.has(value.id));
      if (allSelected && newCheckedItems.has("null")) {
        newCheckedItems.add("all");
      } else {
        newCheckedItems.delete("all");
      }
    },
    [item.bundle?.values]
  );

  // Одиночный чекбокс
  const handleCheckboxChange = useCallback(
    (id: string, isChecked: boolean) => {
      const newCheckedItems = new Set(checkedItems);
      if (id === "all") {
        handleSelectAll(newCheckedItems, isChecked);
      } else {
        if (isChecked) {
          newCheckedItems.add(id);
        } else {
          newCheckedItems.delete(id);
        }
        updateAllSelectionState(newCheckedItems);
      }
      const selectedArray = Array.from(newCheckedItems);
      onSelectionChange(item.field.id, selectedArray.length > 0 ? selectedArray : null);
      setCheckedItems(newCheckedItems);
    },
    [checkedItems, handleSelectAll, updateAllSelectionState, item.field.id, onSelectionChange]
  );

  // Очистить всё (сброс)
  const cleanCheckedItems = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setCheckedItems(new Set());
    onSelectionChange(item.field.id, null);
  }, [item.field.id, onSelectionChange]);

  return (
    <div className={styles.dropdown} id={item.field.id}>
      <button
        type="button"
        className={`${styles.dropdown__toggle} ${
          checkedItems.size > 0 ? styles.dropdown__toggle_notEmpty : ""
        }`}
        onClick={toggleDropdown}
      >
        {checkedItems.size > 0 ? (
          <>
            <span className={styles["dropdown__toggle-label"]}>{item.field.name}</span>
            <span className={styles["dropdown__toggle-label_variants"]}>
              {checkedStr}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className={styles["dropdown__toggle-icon_clean"]}
              color="currentColor"
              onClick={cleanCheckedItems}
            >
              <path d="M13.63 3.65l-1.28-1.27L8 6.73 3.64 2.38 2.37 3.65l4.35 4.36-4.34 4.34 1.27 1.28L8 9.28l4.35 4.36 1.28-1.28-4.36-4.35 4.36-4.36z"/>
            </svg>
          </>
        ) : (
          <span className={styles["dropdown__toggle-label"]}>
            Выберите вариант {item.field.localizedName || item.field.name}
          </span>
        )}
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
          <FilterItemOption
            key="all"
            parent={item.field.id}
            item={{ name: "Выбрать всё", id: "all", $type: "all", ordinal: -2 }}
            isCheckedItem={checkedItems.has("all")}
            onChange={handleCheckboxChange}
          />
          <FilterItemOption
            key="null"
            parent={item.field.id}
            item={{ name: item.emptyFieldText || "(Пусто)", id: "null", $type: "null", ordinal: -1 }}
            isCheckedItem={checkedItems.has("null")}
            onChange={handleCheckboxChange}
          />
          {item.bundle?.values.map((point) => (
            <FilterItemOption
              key={point.id}
              parent={item.field.id}
              item={point}
              isCheckedItem={checkedItems.has(point.id)}
              onChange={handleCheckboxChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterItem);