import { PayloadAction, createAsyncThunk, createSlice, current, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { IDiningTable } from 'app/shared/model/dining-table.model';
import { IOrder, defaultValue } from 'app/shared/model/order/order.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Action } from 'rxjs/internal/scheduler/Action';
import { IMenuItem } from 'app/shared/model/menu-item.model';

const initialState = {
  isEstablishingConnection: false,
  isConnected: false,
  loading: false,
  activeOrders: [],
  selectedTable: [],
  currentOrder: defaultValue,
  currentTab: 'ordering-tab',
  changedDetailId: null,
};

const apiUrl = 'api/orders';

export const getEntities = createAsyncThunk('orders/fetch_entity_list', async () => {
  const requestUrl = `${apiUrl}/active?cacheBuster=${new Date().getTime()}`;
  return axios.get<IOrder[]>(requestUrl);
});

// slice

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    startConnecting(state) {
      state.isEstablishingConnection = true;
    },
    connectionEstablished(state) {
      state.isConnected = true;
      state.isEstablishingConnection = true;
    },
    receiveAllActiveOrders(state, action: PayloadAction<IOrder[]>) {
      state.activeOrders = action.payload;
    },
    createOrder(state, action: PayloadAction<string>) {
      return;
    },
    adjustDetailQuantity(state, action: PayloadAction<{ orderDetailId: string; quantityAdjust: number }>) {
      return;
    },
    addOrderDetail(state, action: PayloadAction<{ menuItem: IMenuItem; quantity: number }>) {
      return;
    },
    notifyKitchen(state, action: PayloadAction<string>) {
      return;
    },
    deleteOrderDetail(state, action: PayloadAction<string>) {
      return;
    },
    receiveChangedOrder(state, action) {
      const toUpdateOrder: IOrder = action.payload;
      const isUpdate = state.activeOrders.map(order => order.id).includes(toUpdateOrder.id);

      const nextOrderList = state.activeOrders.map((order: IOrder) => {
        if (order.id === toUpdateOrder.id) return toUpdateOrder;
        return order;
      });

      state.currentOrder = toUpdateOrder;
      if (isUpdate) state.activeOrders = nextOrderList;
      else state.activeOrders = [...nextOrderList, toUpdateOrder];
    },
    selectOrderByTable(state, action) {
      const selectedTable = action.payload;
      const selectedOrder = state.activeOrders.find((order: IOrder) => order.tableList.map(table => table.id).includes(selectedTable.id));
      state.currentOrder = selectedOrder ? selectedOrder : { ...defaultValue, tableList: [selectedTable] };
    },
    selectTab(state, action) {
      const selectedTableId = action.payload;
      const selectedOrder = state.activeOrders.find((order: IOrder) => order.tableList.map(table => table.id).includes(selectedTableId));
      state.currentOrder = selectedOrder ? selectedOrder : null;
    },
    setChangedDetailId(state, action) {
      state.changedDetailId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getEntities.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOrders = action.payload.data;
      });
  },
});
export const orderActions = OrderSlice.actions;

// Reducer
export default OrderSlice.reducer;
