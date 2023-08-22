import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
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

export const updateRestaurantInfo = createAsyncThunk(
  'role/update_restaurant_info',
  async (entity: any, thunkApi) => {
    const result = await axios.put(apiUrl, entity);
    thunkApi.dispatch(getRestaurantInfo());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getCheckoutUrl = createAsyncThunk(
  'role/update_restaurant_info',
  async (planName: any) => {
    const result = await axios.post('api/subscriptions/create-checkout-session?planName=' + planName);
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const getPortalUrl = createAsyncThunk(
  'role/update_restaurant_info',
  async () => {
    const result = await axios.post('api/subscriptions/create-portal-session');
    return result;
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
      .addMatcher(isPending(getRestaurantInfo), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(getCheckoutUrl, getPortalUrl), (state, action) => {
        window.location.replace(action.payload.data);
      })
      .addMatcher(isFulfilled(updateRestaurantInfo), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      })
      .addMatcher(isPending(updateRestaurantInfo, getCheckoutUrl, getPortalUrl), state => {
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(isRejected(updateRestaurantInfo, getRestaurantInfo, getCheckoutUrl, getPortalUrl), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
      });
  },
});

// Reducer
export default RestaurantSlice.reducer;
