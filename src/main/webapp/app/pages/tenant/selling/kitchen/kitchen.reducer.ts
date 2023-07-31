import { PayloadAction, createAsyncThunk, createSlice, current, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { IDiningTable } from 'app/shared/model/dining-table.model';
import { IOrder, defaultValue } from 'app/shared/model/order/order.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { Action } from 'rxjs/internal/scheduler/Action';
import { IMenuItem } from 'app/shared/model/menu-item.model';
import { Kitchen } from './kitchen';
import { IItemAdditionNotification } from 'app/shared/model/order/item-addition-notfication.model';

const initialState = {
  isEstablishingConnection: false,
  isConnected: false,
  loading: false,
  preparingItems: [],
  selectedTable: [],
  currentOrder: defaultValue,
  changedDetailId: null,
};

const apiUrl = 'api/orders';

export const getEntities = createAsyncThunk('orders/fetch_entity_list', async () => {
  const requestUrl = `${apiUrl}/uncompleted-orders?cacheBuster=${new Date().getTime()}`;
  return axios.get<IItemAdditionNotification[]>(requestUrl);
});

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
    receiveAllActiveOrders(state, action: PayloadAction<IOrder[]>) {
      state.preparingItems = action.payload;
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
      const isUpdate = state.preparingItems.map(order => order.id).includes(toUpdateOrder.id);

      const nextOrderList = state.preparingItems.map((order: IOrder) => {
        if (order.id === toUpdateOrder.id) return toUpdateOrder;
        return order;
      });

      state.currentOrder = toUpdateOrder;
      if (isUpdate) state.preparingItems = nextOrderList;
      else state.preparingItems = [...nextOrderList, toUpdateOrder];
    },
    selectOrderByTable(state, action) {
      const selectedTable = action.payload;
      const selectedOrder = state.preparingItems.find((order: IOrder) => order.tableList.map(table => table.id).includes(selectedTable.id));
      state.currentOrder = selectedOrder ? selectedOrder : { ...defaultValue, tableList: [selectedTable] };
    },
    selectTab(state, action) {
      const selectedTableId = action.payload;
      const selectedOrder = state.preparingItems.find((order: IOrder) => order.tableList.map(table => table.id).includes(selectedTableId));
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
        state.preparingItems = action.payload.data;
      });
  },
});
export const kitchenActions = KitchenSlice.actions;

// Reducer
export default KitchenSlice.reducer;
