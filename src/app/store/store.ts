import { configureStore } from '@reduxjs/toolkit';
import tableDataReducer from './tableDataSlice';

const store = configureStore({
  reducer: {
    table: tableDataReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;