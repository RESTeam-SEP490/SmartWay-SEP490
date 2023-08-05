import { createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';
import { defaultValue, IBankAccountInfo } from 'app/shared/model/bank-account-info';
import { cleanEntity, getListValuesInParam } from 'app/shared/util/entity-utils';

const initialState: EntityState<IBankAccountInfo> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/bankAccountInfo';

export const getEntities = createAsyncThunk('/bankAccountInfo/fetch_entity_list', async () => {
  return axios.get<IBankAccountInfo[]>(apiUrl);
});

export const getEntity = createAsyncThunk(
  'bankAccountInfo/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IBankAccountInfo>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const setDefaultBankAccountInfo = createAsyncThunk(
  'bankAccountInfo/update_entity',
  async (id: string, thunkAPI) => {
    const result = await axios.put<IBankAccountInfo>(`${apiUrl}/setDefault/${id}`);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const setActiveBankAccountInfo = createAsyncThunk(
  'bankAccountInfo/update_entity',
  async (id: string, thunkAPI) => {
    const result = await axios.put<IBankAccountInfo>(`${apiUrl}/setActive/${id}`);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'bankAccountInfo/create_entity',
  async (entity: IBankAccountInfo, thunkAPI) => {
    const result = await axios.post<IBankAccountInfo>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'bankAccountInfo/update_entity',
  async (entity: IBankAccountInfo, thunkAPI) => {
    const result = await axios.put<IBankAccountInfo>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'bankAccount/delete-entity',
  async (ids: React.Key[], thunkAPI) => {
    const requestUrl = `${apiUrl}?ids=${getListValuesInParam(ids)}`;
    const result = await axios.delete<IBankAccountInfo>(requestUrl);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const BankAccountSlice = createEntitySlice({
  name: 'bankAccount',
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
      .addMatcher(isFulfilled(createEntity, updateEntity, setDefaultBankAccountInfo), (state, action) => {
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
      .addMatcher(isPending(createEntity, updateEntity, deleteEntity, setDefaultBankAccountInfo), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = BankAccountSlice.actions;

export default BankAccountSlice.reducer;
