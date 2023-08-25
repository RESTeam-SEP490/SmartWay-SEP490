import { createAsyncThunk, createSlice, isFulfilled, isPending } from '@reduxjs/toolkit';
import { ITenant } from 'app/shared/model/tenant';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { defaultValue } from 'app/shared/model/staff.model';

const initialState = {
  loading: false,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type TenantState = Readonly<typeof initialState>;

const apiUrl = 'api/tenant-profile';

export const updateTenant = createAsyncThunk(
  'tenant/update_entity',
  async (entity: ITenant, thunkAPI) => {
    const result = await axios.put<ITenant>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getTenant());
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const getTenant = createAsyncThunk(
  'tenant/fetch_entity',
  async () => {
    const requestUrl = `${apiUrl}`;
    return axios.get<ITenant>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const TenantSlice = createSlice({
  name: 'tenant',
  initialState: initialState as TenantState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getTenant), state => {
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isFulfilled(updateTenant), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isPending(updateTenant), state => {
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export default TenantSlice.reducer;
