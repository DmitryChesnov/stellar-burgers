import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducer } from './rootReducer'; // ИЗМЕНЕНО: Импорт корневого редьюсера

export const store = configureStore({
  reducer: rootReducer, // ИЗМЕНЕНО: Используем корневой редьюсер
  devTools: process.env.NODE_ENV !== 'production'
});

// ИЗМЕНЕНО: Правильные типы для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
