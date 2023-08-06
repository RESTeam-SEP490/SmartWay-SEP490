import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { IMenuItem } from 'app/shared/model/menu-item.model';
import { defaultValue, IOrder } from 'app/shared/model/order/order.model';
import { receiveChangedTable } from '../../management/dining-table/dining-table.reducer';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import thunk from 'redux-thunk';
import getStore from 'app/config/store';
import { DiningTableSlice } from '../../management/dining-table/dining-table.reducer';

const initialState = {
  isEstablishingConnection: false,
  isConnected: false,
  loading: false,
  updating: false,
  updateSuccess: false,
  activeOrders: [],
  currentOrder: defaultValue,
  changedDetailId: null,
};

const apiUrl = 'api/orders';

export const getEntities = createAsyncThunk('orders/fetch_entity_list', async () => {
  const requestUrl = `${apiUrl}/active-orders?cacheBuster=${new Date().getTime()}`;
  return axios.get<IOrder[]>(requestUrl);
});

export const addNote = createAsyncThunk(
  'orders/add_note',
  async (detailAddnoteDto: { orderDetailId: string; note: string }) => {
    const requestUrl = `${apiUrl}/add-note`;
    const result = axios.put<IOrder>(requestUrl, detailAddnoteDto);
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const groupTables = createAsyncThunk(
  'orders/group_tables',
  async (dto: { orderId: string; tableList: string[] }, thunkAPI) => {
    const requestUrl = `${apiUrl}/${dto.orderId}/group-tables`;
    const result = axios.put<IOrder>(requestUrl, dto.tableList);
    return result;
  },
  { serializeError: serializeAxiosError }
);

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
    changePriority(state, action: PayloadAction<{ orderDetailId: string; priority: boolean }>) {
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

      const currentSelectedTable = state.currentOrder.tableList;
      const isUpdateCurrentOrder = currentSelectedTable.some(table => toUpdateOrder.tableList.some(t => t.id === table.id));

      if (isUpdateCurrentOrder) state.currentOrder = toUpdateOrder;

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
    disconnectStomp(state) {
      state.isConnected = false;
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
      })
      .addMatcher(isPending(addNote, groupTables), (state, action) => {
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(isFulfilled(addNote, groupTables), (state, action) => {
        state.updateSuccess = true;
        state.updating = false;

        const toUpdateOrder = action.payload.data;

        let isNew = true;
        const nextActiveOrders = state.activeOrders.map(order => {
          if (order.id === toUpdateOrder.id) {
            isNew = false;
            return toUpdateOrder;
          } else return order;
        });

        if (isNew) state.activeOrders = [...nextActiveOrders, toUpdateOrder];
        else state.activeOrders = nextActiveOrders;

        if (state.currentOrder.id === toUpdateOrder.id) state.currentOrder = toUpdateOrder;
      })
      .addMatcher(isRejected(addNote, groupTables, getEntities), (state, action) => {
        state.updating = false;
      });
  },
});
export const orderActions = OrderSlice.actions;

// Reducer
export default OrderSlice.reducer;
