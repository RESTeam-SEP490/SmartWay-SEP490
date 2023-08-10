import { createAsyncThunk, createSlice, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { IRestaurant } from 'app/shared/model/restaurant.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  restaurant: {},
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/restaurant';

// Actions

export const getRestaurantInfo = createAsyncThunk(
  'restaurant/fetch_entity',
  async () => {
    const requestUrl = `${apiUrl}`;
    return axios.get<IRestaurant>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

// slice

export const RestaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRestaurantInfo), (state, action) => {
        const { data } = action.payload;
        return {
          ...state,
          restaurant: data,
          loading: false,
        };
      })
      .addMatcher(isFulfilled(), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(getRestaurantInfo), state => {
        state.updateSuccess = false;
        state.loading = true;
      });
  },
});

// Reducer
export default RestaurantSlice.reducer;
