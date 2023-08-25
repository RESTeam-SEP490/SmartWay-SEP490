import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';

import { IRestaurant } from 'app/shared/model/restaurant.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import restaurantReducer from '../management/restaurant/restaurant.reducer';

const initialState = {
  loading: false,
  restaurant: {},
  updating: false,
  updateSuccess: false,
  isShowSubsciptionModal: false,
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
  'restaurant/update_restaurant_info',
  async (entity: any, thunkApi) => {
    console.log('123');
    const result = await axios.put(apiUrl, entity);
    thunkApi.dispatch(getRestaurantInfo());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getCheckoutUrl = createAsyncThunk(
  'role/get_checkout_url',
  async (planName: any) => {
    const result = await axios.post('api/subscriptions/create-checkout-session?planName=' + planName);
    return result;
  },
  { serializeError: serializeAxiosError }
);
export const getPortalUrl = createAsyncThunk(
  'role/get_portal_url',
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
  reducers: {
    setIsShowSubsciptionModal(state, action) {
      state.isShowSubsciptionModal = action.payload;
    },
  },
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

export const restaurantActions = RestaurantSlice.actions;

// Reducer
export default RestaurantSlice.reducer;
