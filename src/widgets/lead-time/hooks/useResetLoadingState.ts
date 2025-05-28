import { useEffect } from "react";
import { resetLoadingState } from "../features/slice";
import { RootState } from "../store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { MILLISECONDS_IN_MINUTES, NUMBER_OF_CHARACTERS } from "../consts";

export function useResetLoadingState(
  dispatch: ThunkDispatch<RootState, void, AnyAction>,
  isLoading: boolean,
  activeRequests: number
) {
  // Сбрасываем состояние загрузки при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(resetLoadingState());
    };
  }, [dispatch]);

  // Сбрасываем состояние загрузки, если isLoading застрял в true
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    if (isLoading) {
      // Если загрузка длится более 240 секунд, сбрасываем состояние
      timeoutId = setTimeout(() => {
        if (activeRequests > 0) {
          dispatch(resetLoadingState());
        }
      }, MILLISECONDS_IN_MINUTES * NUMBER_OF_CHARACTERS * NUMBER_OF_CHARACTERS); // 240 секунд
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading, activeRequests, dispatch]);
}