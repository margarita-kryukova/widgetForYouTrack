import { configureStore } from '@reduxjs/toolkit';
import slice from './features/slice';

const store = configureStore({
    reducer: {
        data: slice,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store