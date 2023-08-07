import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { IMenuItem } from 'app/shared/model/menu-item.model';
import { defaultValue, IOrder } from 'app/shared/model/order/order.model';
import { receiveChangedTable } from '../../management/dining-table/dining-table.reducer';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import thunk from 'redux-thunk';
import getStore from 'app/config/store';
import { DiningTableSlice } from '../../management/dining-table/dining-table.reducer';
import TableList from './order-screen-components/table-list';
import { act } from 'react-dom/test-utils';

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
  return await axios.get<IOrder[]>(requestUrl);
});

export const printBill = createAsyncThunk('orders/print_bill', async (id: string) => {
  const requestUrl = `${apiUrl}/${id}/print-bill?cacheBuster=${new Date().getTime()}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };
  return await axios.get<ArrayBuffer>(requestUrl, { responseType: 'arraybuffer', headers });
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

export const cancelOrderDetail = createAsyncThunk(
  'orders/cancel_order_detail',
  async (dto: { isCancelServedItemFirst: boolean; orderDetailId: string; cancelledQuantity: number }, thunkAPI) => {
    const requestUrl = `${apiUrl}/cancel-order-detail`;
    const result = axios.post<IOrder>(requestUrl, dto);
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const pay = createAsyncThunk(
  'orders/cancel_order_detail',
  async (id: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}/pay`;
    const result = axios.post<ArrayBuffer>(requestUrl);
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

      const nextOrderList = state.activeOrders
        .map((order: IOrder) => {
          if (order.id === toUpdateOrder.id) return toUpdateOrder;
          return order;
        })
        .filter(order => order.tableList.length > 1 || toUpdateOrder.tableList.every(t => t.id !== order.tableList[0].id));

      const currentSelectedTable = state.currentOrder.tableList;
      const isUpdateCurrentOrder = currentSelectedTable.some(table => toUpdateOrder.tableList.some(t => t.id === table.id));

      if (isUpdateCurrentOrder) state.currentOrder = toUpdateOrder;

      state.activeOrders = [...nextOrderList, toUpdateOrder];
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
      .addMatcher(isFulfilled(printBill, pay), (state, action) => {
        const pdfUrl = window.URL.createObjectURL(new Blob([action.payload.data], { type: 'application/pdf' }));
        const iframe = document.createElement('iframe');
        iframe.src = pdfUrl;
        iframe.style.display = 'none';

        document.body.appendChild(iframe);

        iframe.contentWindow.print();
      })
      .addMatcher(isPending(addNote, groupTables, cancelOrderDetail), (state, action) => {
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(isFulfilled(addNote, groupTables, cancelOrderDetail), (state, action) => {
        state.updateSuccess = true;
        state.updating = false;
      })
      .addMatcher(isRejected(addNote, groupTables, getEntities), (state, action) => {
        state.updating = false;
      });
  },
});
export const orderActions = OrderSlice.actions;

// Reducer
export default OrderSlice.reducer;
