import { defaultValue, IStaff } from 'app/shared/model/staff.model';
import { createEntitySlice, EntityState, IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';
import getStore from 'app/config/store';
import { DEFAULT_PAGEABLE } from 'app/app.constant';
import { cleanEntity, getListValuesInParam } from 'app/shared/util/entity-utils';
import { updateIsActiveEntity } from 'app/pages/tenant/management/menu-item/menu-item.reducer';
import { translate } from 'react-jhipster';

const initialState: EntityState<IStaff> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  pageable: { ...DEFAULT_PAGEABLE },
};

const apiUrl = 'api/staffs';

export const setPageable = createAsyncThunk('staff/set_pageable', (pageable: IQueryParams) => {
  return pageable;
});

export const getEntities = createAsyncThunk('/staff/fetch_entity_list', async () => {
  const { sort, page, size, role, search } = getStore().getState().staff.pageable;
  const requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}&search=${search ? search : ''}&roleIds=${getListValuesInParam(
    role
  )}`;
  return axios.get<IStaff[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'staff/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IStaff>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'staff/create_entity',
  async (entity: IStaff, thunkAPI) => {
    const result = await axios.post<IStaff>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'staff/update_entity',
  async (entity: IStaff, thunkAPI) => {
    const result = await axios.put<IStaff>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'staff/delete-entity',
  async (ids: React.Key[], thunkAPI) => {
    const requestUrl = `${apiUrl}?ids=${getListValuesInParam(ids)}`;
    const result = await axios.delete<IStaff>(requestUrl);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const StaffSlice = createEntitySlice({
  name: 'staff',
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
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
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
      .addMatcher(isFulfilled(createEntity, updateEntity, updateIsActiveEntity), (state, action) => {
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
      .addMatcher(isPending(createEntity, updateEntity, updateIsActiveEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

// Validation for staff form
export const validateEmail = (_, value) => {
  const emailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value) && value) {
    return Promise.reject(new Error(translate('entity.validation.email')));
  }
  return Promise.resolve();
};

export const validatePhone = (_, value) => {
  const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(value) && value) {
    return Promise.reject(new Error(translate('entity.validation..phoneRegexCS')));
  }
  return Promise.resolve();
};

export const { reset } = StaffSlice.actions;

export default StaffSlice.reducer;
