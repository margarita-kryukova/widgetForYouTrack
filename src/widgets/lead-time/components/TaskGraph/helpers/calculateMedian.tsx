import { NUMBER_OF_CHARACTERS } from "../../../consts";


export function calculateMedian(array: number[]): number {
  const len = array.length;

  // Если длина массива пустая
  if (len === 0) {
    return 0;
  }

  const midIndex = Math.floor(len / NUMBER_OF_CHARACTERS);

  // Если длина массива нечетная, берем средний элемент
  if (len % NUMBER_OF_CHARACTERS !== 0) {
    return array[midIndex];
  } else {
    // Если четная, берем среднее из двух средних значений
    return (array[midIndex - 1] + array[midIndex]) / NUMBER_OF_CHARACTERS;
  }
}
