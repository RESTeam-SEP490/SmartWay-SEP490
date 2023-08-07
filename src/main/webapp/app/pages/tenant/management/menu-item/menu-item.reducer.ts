import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';

import { cleanEntity, getListValuesInParam } from 'app/shared/util/entity-utils';
import { createEntitySlice, EntityState, IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { defaultValue, IMenuItem } from 'app/shared/model/menu-item.model';
import { DEFAULT_PAGEABLE } from 'app/app.constant';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';
import getStore from 'app/config/store';

const initialState: EntityState<IMenuItem> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  pageable: { ...DEFAULT_PAGEABLE, isActive: true },
};

const apiUrl = 'api/menu-items';

// Actions

export const getEntities = createAsyncThunk('menuItem/fetch_entity_list', async () => {
  const { sort, page, size, search, category, isActive } = getStore().getState().menuItem.pageable;
  const requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}&isActive=${isActive !== undefined ? isActive : ''}&search=${
    search ? search : ''
  }&categoryIds=${getListValuesInParam(category)}`;
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
    const result = await axios.post<IMenuItem>(apiUrl, data);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'menuItem/update_entity',
  async (entity: IMenuItem, thunkAPI) => {
    const data = new FormData();
    data.append('imageSource', entity.imageSource);
    entity['imageSource'] = null;
    data.append(
      'menuItemDTO',
      new Blob([JSON.stringify(cleanEntity(entity))], {
        type: 'application/json',
      })
    );
    const result = await axios.put<IMenuItem>(`${apiUrl}/${entity.id}`, data);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateIsActiveEntity = createAsyncThunk(
  'menuItem/partial_update_entity',
  async (data: IListUpdateBoolean, thunkAPI) => {
    const result = await axios.put<IMenuItem>(`${apiUrl}`, data);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'menuItem/delete_entity',
  async (ids: React.Key[], thunkAPI) => {
    const requestUrl = `${apiUrl}?ids=${getListValuesInParam(ids)}`;
    const result = await axios.delete<IMenuItem>(requestUrl);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const MenuItemSlice = createEntitySlice({
  name: 'menuItem',
  initialState,
  reducers: {
    setPageable(state, action) {
      state.pageable = action.payload;
    },
  },
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

export const { reset, setPageable } = MenuItemSlice.actions;

// Reducer
export default MenuItemSlice.reducer;
