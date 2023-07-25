import { createAsyncThunk, current, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULT_PAGEABLE } from 'app/app.constant';
import getStore from 'app/config/store';
import { IDiningTable, defaultValue } from 'app/shared/model/dining-table.model';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { cleanEntity, getListValuesInParam } from 'app/shared/util/entity-utils';

const initialState: EntityState<IDiningTable> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  pageable: { ...DEFAULT_PAGEABLE, isActive: true },
};

const apiUrl = 'api/dining_tables';

// Actions

export const getEntities = createAsyncThunk('diningTable/fetch_entity_list', async () => {
  const { sort, page, size, search, zone, isActive } = getStore().getState().diningTable.pageable;
  const requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}&isActive=${isActive !== undefined ? isActive : ''}&search=${
    search ? search : ''
  }&zoneIds=${getListValuesInParam(zone)}`;
  return axios.get<IDiningTable[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'diningTable/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IDiningTable>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'diningTable/create_entity',
  async (entity: IDiningTable, thunkAPI) => {
    const result = await axios.post<IDiningTable>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'diningTable/update_entity',
  async (entity: IDiningTable, thunkAPI) => {
    const result = await axios.put<IDiningTable>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateIsActiveEntity = createAsyncThunk(
  'dđiingTable/partial_update_entity',
  async (data: IListUpdateBoolean, thunkAPI) => {
    const result = await axios.put<IDiningTable>(`${apiUrl}`, data);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'diningTable/delete_entity',
  async (ids: React.Key[], thunkAPI) => {
    const requestUrl = `${apiUrl}?ids=${getListValuesInParam(ids)}`;
    const result = await axios.delete<IDiningTable>(requestUrl);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const DiningTableSlice = createEntitySlice({
  name: 'diningTable',
  initialState,
  reducers: {
    setPageable(state, action) {
      state.pageable = action.payload;
    },
    websocketUpdateTable(state, action) {
      const toUpdateTable = action.payload.table;
      const nextTableList = state.entities.map(table => {
        if (table.id === toUpdateTable.id) return toUpdateTable;
        return table;
      });
      state.entities = nextTableList;
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

export const { reset, setPageable, websocketUpdateTable } = DiningTableSlice.actions;

// Reducer
export default DiningTableSlice.reducer;
