import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/bugs';

export const fetchBugs = createAsyncThunk('bugs/fetchBugs', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createBug = createAsyncThunk('bugs/createBug', async (bugData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.post(API_URL, bugData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const bugsSlice = createSlice({
  name: 'bugs',
  initialState: {
    bugs: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBugs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBugs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bugs = action.payload;
      })
      .addCase(fetchBugs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createBug.fulfilled, (state, action) => {
        state.bugs.push(action.payload);
      });
  },
});

export default bugsSlice.reducer;