import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { IMenuItem } from 'app/shared/model/menu-item.model';
import { defaultValue, IOrder } from 'app/shared/model/order/order.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { notification } from 'antd';
import { translate } from 'react-jhipster';
import { OrderDetails } from './order-screen-components/order-details';

const initialState = {
  isEstablishingConnection: false,
  isConnected: false,
  loading: false,
  updating: false,
  updateSuccess: false,
  activeOrders: [],
  currentOrder: defaultValue,
};

const apiUrl = 'api/orders';

export const getEntities = createAsyncThunk('orders/fetch_entity_list', async () => {
  const requestUrl = `${apiUrl}/active-orders?cacheBuster=${new Date().getTime()}`;
  return await axios.get<IOrder[]>(requestUrl);
});

export const printBill = createAsyncThunk('orders/print_bill', async (dto: any) => {
  const requestUrl = `${apiUrl}/print-bill?cacheBuster=${new Date().getTime()}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
  };
  return await axios.post<ArrayBuffer>(requestUrl, dto, { responseType: 'arraybuffer', headers });
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
    const result = axios.put<IOrder>(requestUrl, dto);
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel_order',
  async (dto: { orderId: string; cancellationReason: string; cancellationNote: string }, thunkAPI) => {
    const requestUrl = `${apiUrl}/cancel-order`;
    const result = axios.put<IOrder>(requestUrl, dto);
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const checkOut = createAsyncThunk(
  'orders/checkOut',
  async (
    dto: { orderId: string; isPayByCash: boolean; bankAccountId: string | null; discount: number; listItemsReturn: any },
    thunkAPI
  ) => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/pdf',
    };
    const requestUrl = `${apiUrl}/check-out`;
    const result = axios.post<ArrayBuffer>(requestUrl, dto, { responseType: 'arraybuffer', headers });
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const freeUpTable = createAsyncThunk(
  'orders/free_up_table',
  async (orderId: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/free-up-table?orderId=${orderId}`;
    const result = axios.put<ArrayBuffer>(requestUrl);
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
    createOrder(state, action: PayloadAction<{ menuItemId: string; tableIdList: string[] }>) {
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

      let isNewOrder = true;
      let nextOrderList = state.activeOrders.map((order: IOrder) => {
        if (order.id === toUpdateOrder.id) {
          isNewOrder = false;
          return toUpdateOrder;
        }
        return order;
      });

      if (toUpdateOrder.takeAway) {
        if (isNewOrder) state.activeOrders = [...nextOrderList, toUpdateOrder];
        else state.activeOrders = nextOrderList;

        if (state.currentOrder.id === toUpdateOrder.id) state.currentOrder = toUpdateOrder;
      } else {
        nextOrderList = nextOrderList.filter(
          order => order.takeAway || order.tableList.length > 1 || toUpdateOrder.tableList.every(t => t.id !== order.tableList[0].id)
        );
        const currentSelectedTable = state.currentOrder.tableList;
        const isUpdateCurrentOrder = currentSelectedTable.some(table => toUpdateOrder.tableList.some(t => t.id === table.id));
        if (isUpdateCurrentOrder) state.currentOrder = toUpdateOrder;
        state.activeOrders = [...nextOrderList, toUpdateOrder];
      }
    },
    selectOrderByTable(state, action) {
      const selectedTable = action.payload;
      const selectedOrder = state.activeOrders.find(
        (order: IOrder) => !order.takeAway && order.tableList.map(table => table.id).includes(selectedTable.id)
      );
      state.currentOrder = selectedOrder ? selectedOrder : { ...defaultValue, tableList: [selectedTable] };
    },
    selectOrderById(state, action) {
      const orderId = action.payload;
      const selectedOrder = [...state.activeOrders].find((order: IOrder) => order.id === orderId);
      if (selectedOrder) state.currentOrder = selectedOrder;
    },
    selectTab(state, action) {
      const selectedTableId = action.payload;
      const selectedOrder = state.activeOrders.find((order: IOrder) => order.tableList.map(table => table.id).includes(selectedTableId));
      state.currentOrder = selectedOrder ? selectedOrder : null;
    },
    receiveNewPayment(state, action) {
      const paidOrderId = action.payload;
      state.activeOrders = state.activeOrders.filter(o => o.id !== paidOrderId);
      if (state.currentOrder.id === paidOrderId)
        state.currentOrder = { ...defaultValue, tableList: state.currentOrder.takeAway ? [] : [state.currentOrder.tableList[0]] };
    },
    disconnectStomp(state) {
      state.isConnected = false;
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
        state.activeOrders = action.payload.data;

        if (state.currentOrder.id !== null) {
          const nextCurrentOrder = state.activeOrders.find(o => o.id === state.currentOrder.id);
          if (nextCurrentOrder) state.currentOrder = nextCurrentOrder;
        }
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.updateSuccess = true;
        state.updating = false;
        notification.success({ message: translate('order.checkout.success') });
        const pdfUrl = window.URL.createObjectURL(new Blob([action.payload.data], { type: 'application/pdf' }));
        const iframe = document.createElement('iframe');
        iframe.src = pdfUrl;
        iframe.style.display = 'none';

        document.body.appendChild(iframe);

        iframe.contentWindow.print();
      })
      .addMatcher(isFulfilled(printBill), (state, action) => {
        state.updateSuccess = true;
        state.updating = false;
        const pdfUrl = window.URL.createObjectURL(new Blob([action.payload.data], { type: 'application/pdf' }));
        const iframe = document.createElement('iframe');
        iframe.src = pdfUrl;
        iframe.style.display = 'none';

        document.body.appendChild(iframe);

        iframe.contentWindow.print();
      })
      .addMatcher(isPending(addNote, groupTables, cancelOrderDetail, cancelOrder, checkOut, printBill, freeUpTable), (state, action) => {
        state.updateSuccess = false;
        state.updating = true;
      })
      .addMatcher(isFulfilled(addNote, groupTables, cancelOrderDetail, cancelOrder, freeUpTable), (state, action) => {
        state.updateSuccess = true;
        state.updating = false;
      })
      .addMatcher(isRejected(addNote, groupTables, getEntities, printBill, cancelOrder, cancelOrderDetail, checkOut), (state, action) => {
        state.updating = false;
      });
  },
});
export const orderActions = OrderSlice.actions;

// Reducer
export default OrderSlice.reducer;
