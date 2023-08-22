import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { createEntitySlice, EntityState, IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { DEFAULT_PAGEABLE } from 'app/app.constant';
import getStore from 'app/config/store';
import { defaultValue, IAdminRestaurant } from 'app/shared/model/adminRestaurant';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';
import { cleanEntity } from 'app/shared/util/entity-utils';

const initialState: EntityState<IAdminRestaurant> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  pageable: { ...DEFAULT_PAGEABLE, isActive: true },
};

const apiUrl = 'api/adminRestaurant';

// Actions

export const setPageable = createAsyncThunk('adminRestaurant/set_pageable', (pageable: IQueryParams) => {
  return pageable;
});

export const getEntities = createAsyncThunk('adminRestaurant/fetch_entity_list', async () => {
  const { sort, page, size, search, isActive } = getStore().getState().adminRestaurant.pageable;
  const requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}&isActive=${isActive !== undefined ? isActive : ''}&search=${
    search ? search : ''
  }`;
  return axios.get<IAdminRestaurant[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'adminRestaurant/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IAdminRestaurant>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'adminRestaurant/update_entity',
  async (entity: IAdminRestaurant, thunkAPI) => {
    const result = await axios.put<IAdminRestaurant>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateIsActiveEntity = createAsyncThunk(
  'adminRestaurant/partial_update_entity',
  async (data: IListUpdateBoolean, thunkAPI) => {
    const result = await axios.put<IAdminRestaurant>(`${apiUrl}`, data);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const AdminRestaurantSlice = createEntitySlice({
  name: 'adminRestaurant',
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
      .addMatcher(isPending(getEntities, getEntity), state => {
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

export const { reset } = AdminRestaurantSlice.actions;

// Reducer
export default AdminRestaurantSlice.reducer;
