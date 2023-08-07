import { createAsyncThunk, createSlice, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { defaultValue } from 'app/shared/model/staff.model';
import { IChangePassword } from 'app/shared/model/change-password';

const initialState = {
  loading: false,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type ChangePasswordState = Readonly<typeof initialState>;

const apiUrl = 'api/tenant-profile/change-password';

export const changePassword = createAsyncThunk(
  'changePassword/updateEntity',
  async (entity: IChangePassword, thunkAPI) => {
    return await axios.put<IChangePassword>(apiUrl, cleanEntity(entity));
  },
  { serializeError: serializeAxiosError }
);

export const ChangePasswordSlice = createSlice({
  name: 'changePassword',
  initialState: initialState as ChangePasswordState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(changePassword), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isPending(changePassword), state => {
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export default ChangePasswordSlice.reducer;
