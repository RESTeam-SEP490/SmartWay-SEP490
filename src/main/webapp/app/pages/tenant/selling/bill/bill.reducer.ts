import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { DEFAULT_PAGEABLE } from 'app/app.constant';
import { defaultValue, IBill } from 'app/shared/model/bill.model';

const initialState = {
  loading: false,
  updating: false,
  updateSuccess: false,
  billList: [],
  currentBill: defaultValue,
  pageable: { ...DEFAULT_PAGEABLE, isActive: true },
  totalItems: 0,
};

const apiUrl = 'api/bills';

export const getEntities = createAsyncThunk('bills/fetch_entity_list', async () => {
  const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`;
  return await axios.get<IBill[]>(requestUrl);
});

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
      .addCase(getEntities.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.billList = action.payload.data;

        if (state.currentBill.id !== null) {
          const nextCurrentOrder = state.billList.find(o => o.id === state.currentBill.id);
          if (nextCurrentOrder) state.currentBill = nextCurrentOrder;
        }
      });
  },
});
export const billActions = BillSlice.actions;

// Reducer
export default BillSlice.reducer;
