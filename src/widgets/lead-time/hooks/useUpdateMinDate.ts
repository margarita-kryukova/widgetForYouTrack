import { useEffect } from "react";
import { updateMinDate } from "../features/slice";
import { RootState } from "../store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export function useUpdateMinDate(
  minDate: Date,
  dispatch: ThunkDispatch<RootState, void, AnyAction>,
) {
  useEffect(() => {
    dispatch(updateMinDate(minDate));
  }, [minDate, dispatch]);
}