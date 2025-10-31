import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  updateUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '@api';

// Асинхронные actions
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      // Важно: возвращаем ошибку через rejectWithValue для корректной обработки
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
});

type TUserState = {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isAuthChecked: boolean; // ДОБАВЛЕНО: флаг проверки авторизации
};

const initialState: TUserState = {
  user: null,
  loading: false,
  error: null,
  isAuthChecked: false // ДОБАВЛЕНО: изначально не проверено
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // ДОБАВЛЕНО: сброс состояния загрузки
    resetLoading: (state) => {
      state.loading = false;
    },
    // ДОБАВЛЕНО: установка флага проверки авторизации
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Update failed';
      })
      // Fetch user - ДОБАВЛЕН полный обработчик
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true; // ДОБАВЛЕНО: авторизация проверена
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
        state.user = null; // Важно: сбрасываем пользователя при ошибке
        state.isAuthChecked = true; // ДОБАВЛЕНО: авторизация проверена (даже при ошибке)
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.user = null; // Все равно сбрасываем пользователя
        state.isAuthChecked = true; // ДОБАВЛЕНО
      });
  }
});

export const { clearError, resetLoading, setAuthChecked } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const getUser = (state: { user: TUserState }) => state.user.user;
export const getUserLoading = (state: { user: TUserState }) =>
  state.user.loading;
export const getUserError = (state: { user: TUserState }) => state.user.error;
export const getIsAuthChecked = (state: { user: TUserState }) =>
  state.user.isAuthChecked;
