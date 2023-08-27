import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { createEntitySlice, EntityState, IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { DEFAULT_PAGEABLE } from 'app/app.constant';
import getStore from 'app/config/store';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { IRestaurantWithAdmin, defaultValue } from 'app/shared/model/restaurant-with-admin.model';

const initialState: EntityState<IRestaurantWithAdmin> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  pageable: { ...DEFAULT_PAGEABLE, isActive: true },
};

const apiUrl = 'api/system-admin';

// Actions

export const setPageable = createAsyncThunk('restaurantWithAdmin/set_pageable', (pageable: IQueryParams) => {
  return pageable;
});

export const getEntities = createAsyncThunk('restaurantWithAdmin/fetch_entity_list', async () => {
  const { sort, page, size, search, isActive } = getStore().getState().restaurantWithAdmin.pageable;
  const requestUrl = `${apiUrl}/restaurant/?page=${page}&size=${size}&sort=${sort}&isActive=${
    isActive !== undefined ? isActive : ''
  }&search=${search ? search : ''}`;
  return axios.get<IRestaurantWithAdmin[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'restaurantWithAdmin/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/restaurant/${id}`;
    return axios.get<IRestaurantWithAdmin>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const getDashboard = createAsyncThunk(
  'restaurantWithAdmin/get_dashboard',
  async () => {
    const requestUrl = `${apiUrl}/dashboard`;
    console.log('123');
    return axios.get<string>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'restaurantWithAdmin/update_entity',
  async (entity: IRestaurantWithAdmin, thunkAPI) => {
    const result = await axios.put<IRestaurantWithAdmin>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateIsActiveEntity = createAsyncThunk(
  'restaurantWithAdmin/partial_update_entity',
  async (data: IListUpdateBoolean, thunkAPI) => {
    const result = await axios.put<IRestaurantWithAdmin>(`${apiUrl}/restaurant`, data);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const RestaurantWithAdminSlice = createEntitySlice({
  name: 'restaurantWithAdmin',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(setPageable.fulfilled, (state, action) => {
        state.pageable = action.payload;
      })
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(getDashboard.fulfilled, (state, action) => {
        state.loading = false;
        window.location.replace(action.payload.data);
      })
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;
        const count = action.payload.headers['x-total-count'];

        return {
          ...state,
          totalItems: Number(count),
          loading: false,
          entities: data,
        };
      })
      .addMatcher(isFulfilled(updateEntity, updateIsActiveEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isPending(getEntities, getEntity, getDashboard), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(updateIsActiveEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = RestaurantWithAdminSlice.actions;

// Reducer
export default RestaurantWithAdminSlice.reducer;
