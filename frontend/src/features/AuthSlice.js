import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const LoginUser = createAsyncThunk("auth/loginUser", async (user, thunkAPI) => {
  try {
    const response = await axios.post("http://localhost:4000/api/auth/login", {
      name: user.username,
      password: user.password,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:4000/api/auth/me");
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

export const Logout = createAsyncThunk("auth/logout", async () => {
  await axios.delete("http://localhost:4000/api/auth/logout");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      return {
        ...state,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      }),
      builder.addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });

    //   Get User Login
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      }),
      builder.addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
