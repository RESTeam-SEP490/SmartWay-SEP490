import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { defaultValue, IKitchenItems } from 'app/shared/model/dto/kitchen-items-dto';
import { defaultValue as defaultOrder } from 'app/shared/model/order/order.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  isEstablishingConnection: false,
  isConnected: false,
  loading: false,
  kitchenItems: defaultValue,
  categoryFilter: [],
  selectedTable: [],
  currentOrder: defaultOrder,
  changedDetailId: null,
};

const apiUrl = 'api/kitchen';

export const getEntities = createAsyncThunk(
  'kitchen/fetch_entity_list',
  async () => {
    const requestUrl = `${apiUrl}/active-items?cacheBuster=${new Date().getTime()}`;
    return axios.get<IKitchenItems>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

// slice

export const KitchenSlice = createSlice({
  name: 'kitchen',
  initialState,
  reducers: {
    startConnecting(state) {
      state.isEstablishingConnection = true;
    },
    connectionEstablished(state) {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },
    receiveNewItem(state, action: PayloadAction<IKitchenItems>) {
      state.kitchenItems = action.payload;
    },
    notifyReadyToServe(state, action: PayloadAction<{ itemAdditionNotificationId: string; readyToServeQuantity: number }>) {
      return;
    },
    hideRts(state, action: PayloadAction<string>) {
      return;
    },
    disconnectStomp(state) {
      state.isConnected = false;
    },
    setCategoryFilter(state, action) {
      state.categoryFilter = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEntities.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.kitchenItems = action.payload.data;
      });
  },
});
export const kitchenActions = KitchenSlice.actions;

// Reducer
export default KitchenSlice.reducer;
