import { BOARD_STAGE_FILTER_FIELDS } from "../../consts";
import { IField } from "../../interfaces";


export function getBoardStageValues(array: IField[]): string {
  const result: string[] = [];
  const boardStageField = array.find((item) => item.field.id === "77-111");

  if (!boardStageField) {
    // eslint-disable-next-line no-console
    console.warn('Field with id "77-111" not found');
    return "";
  } else {
    const stageNames = boardStageField.bundle?.values.map(
      (value) => value.name
    );

    stageNames?.forEach((stageName) => {
      if (stageName in BOARD_STAGE_FILTER_FIELDS) {
        result.push(
          BOARD_STAGE_FILTER_FIELDS[
            stageName as keyof typeof BOARD_STAGE_FILTER_FIELDS
          ]
        );
      }
    });
  }

  return result.join(" ");
}
