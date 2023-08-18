import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { DEFAULT_PAGEABLE } from 'app/app.constant';
import getStore from 'app/config/store';
import { defaultValue, IRestaurant } from 'app/shared/model/restaurant.model';

const initialState: EntityState<IRestaurant> = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  pageable: { ...DEFAULT_PAGEABLE, isActive: true },
};

const apiUrl = 'api/admin/restaurant';

// Actions

export const getEntities = createAsyncThunk('restaurant/fetch_entity_list', async () => {
  const { sort, page, size, search } = getStore().getState().systemAdmin.pageable;
  const requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}&search=${search ? search : ''}`;
  return axios.get<IRestaurant[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'restaurant/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IRestaurant>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

// slice

export const SystemAdminSlice = createEntitySlice({
  name: 'systemAdmin',
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

      .addMatcher(isPending(getEntities, getEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      });
  },
});

export const { reset, setPageable } = SystemAdminSlice.actions;

// Reducer
export default SystemAdminSlice.reducer;
