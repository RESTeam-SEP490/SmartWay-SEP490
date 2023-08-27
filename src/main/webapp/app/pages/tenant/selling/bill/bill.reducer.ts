import { createAsyncThunk, createSlice, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULT_PAGEABLE } from 'app/app.constant';
import { defaultValue, IBill } from 'app/shared/model/bill.model';
import { defaultValue as defaultStatistic, IRevenueByTime } from 'app/shared/model/revenue-by-time';
import getStore from 'app/config/store';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  updating: false,
  updateSuccess: false,
  billList: [],
  statistic: defaultStatistic,
  currentBill: defaultValue,
  pageable: { ...DEFAULT_PAGEABLE, isActive: true, sort: 'payDate,DESC' },
  totalItems: 0,
};

const apiUrl = 'api/bills';

export const getEntities = createAsyncThunk('bills/fetch_entity_list', async () => {
  const { sort, page, size } = getStore().getState().bill.pageable;
  const requestUrl = `${apiUrl}?page=${page}&size=${size}&sort=${sort}`;
  return await axios.get<IBill[]>(requestUrl);
});

export const getStatistic = createAsyncThunk('bills/get_statistic_today', async () => {
  const requestUrl = `${apiUrl}/daily-sales-bill?cacheBuster=${new Date().getTime()}`;
  return await axios.get<IRevenueByTime>(requestUrl);
});

export const deleteEntity = createAsyncThunk(
  'bills/delete-entity',
  async (id: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete(requestUrl);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const BillSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setPageable(state, action) {
      state.pageable = action.payload;
    },
    selectBillById(state, action) {
      const billId = action.payload;
      const selectedBill = [...state.billList].find((order: IBill) => order.id === billId);
      if (selectedBill) state.currentBill = selectedBill;
    },
    reset(state) {
      state = initialState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.billList = action.payload.data;
        const count = action.payload.headers['x-total-count'];
        state.totalItems = Number(count);

        if (state.currentBill.id !== null) {
          const nextCurrentOrder = state.billList.find(o => o.id === state.currentBill.id);
          if (nextCurrentOrder) state.currentBill = nextCurrentOrder;
        }
      })
      .addCase(getStatistic.fulfilled, (state, action) => {
        state.loading = false;
        state.statistic = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, (state, action) => {
        const deletedId = action.payload.headers['x-smartwayapp-params'];
        state.loading = false;
        if (state.currentBill.id === deletedId) state.currentBill = defaultValue;
      })
      .addMatcher(isPending(getEntities, getStatistic, deleteEntity), (state, action) => {
        state.loading = true;
      });
  },
});
export const billActions = BillSlice.actions;

// Reducer
export default BillSlice.reducer;
