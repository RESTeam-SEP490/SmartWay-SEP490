import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IMenuItem, defaultValue } from 'app/shared/model/menu-item.model';
import Header from 'app/shared/layout/header/header';

const initialState: EntityState<IMenuItem> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/menu-items';

// Actions

export const getEntities = createAsyncThunk('menuItem/fetch_entity_list', async ({ sort, page, size, query, category }: IQueryParams) => {
  let categoryQuery = '';
  if (category && category.length > 0) {
    categoryQuery = category.reduce(
      (prev, current, index) => (index === category.length - 1 ? prev + current : prev + current + ','),
      '&categoryIds='
    );
  }
  const requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}&search=${query ? query : ''}${categoryQuery}`;
  return axios.get<IMenuItem[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'menuItem/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IMenuItem>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'menuItem/create_entity',
  async (entity: IMenuItem, thunkAPI) => {
    const data = new FormData();
    data.append('imageSource', entity.imageSource);
    entity['imageSource'] = null;
    data.append(
      'menuItemDTO',
      new Blob([JSON.stringify(entity)], {
        type: 'application/json',
      })
    );
    const result = await axios.post<IMenuItem>(apiUrl, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'menuItem/update_entity',
  async (entity: IMenuItem, thunkAPI) => {
    const result = await axios.put<IMenuItem>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
  'menuItem/partial_update_entity',
  async (entity: IMenuItem, thunkAPI) => {
    const result = await axios.patch<IMenuItem>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'menuItem/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IMenuItem>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const MenuItemSlice = createEntitySlice({
  name: 'menuItem',
  initialState,
  extraReducers(builder) {
    builder
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
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
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
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = MenuItemSlice.actions;

// Reducer
export default MenuItemSlice.reducer;
