// client/src/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fake login logic (replace with real API call)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    // Simulate successful login
    if (email === 'admin@example.com' && password === 'admin') {
      return { email };
    } else {
      return thunkAPI.rejectWithValue('Invalid email or password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
