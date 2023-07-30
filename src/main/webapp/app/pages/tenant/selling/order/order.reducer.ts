import { createAsyncThunk, createSlice, current, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { IDiningTable, defaultValue } from 'app/shared/model/dining-table.model';
import { IOrder } from 'app/shared/model/order.model';
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils';

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: 0,
  updating: false,
  updateSuccess: false,
  selectedTable: defaultValue,
  currentTab: 'ordering-tab',
  changedDetailId: null,
};

const apiUrl = 'api/orders';

export const getEntities = createAsyncThunk('orders/fetch_entity_list', async () => {
  const requestUrl = `${apiUrl}/not-paid?cacheBuster=${new Date().getTime()}`;
  return axios.get<IOrder[]>(requestUrl);
});

export const updateEntity = createAsyncThunk(
  'orders/add_note',
  async (entity: { detailId: string; note: string }, thunkAPI) => {
    entity['imageSource'] = null;
    const result = await axios.put(`${apiUrl}`, entity);
    thunkAPI.dispatch(getEntities());
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    websocketUpdateOrder(state, action) {
      const toUpdateOrder = action.payload;
      const isUpdate = state.entities.map(order => order.id).includes(toUpdateOrder.id);
      const nextOrderList = state.entities.map((order: IOrder) => {
        if (order.id === toUpdateOrder.id) return toUpdateOrder;
        return order;
      });
      if (isUpdate) state.entities = nextOrderList;
      else state.entities = [...nextOrderList, toUpdateOrder];
    },
    selectOrderByTable(state, action) {
      state.selectedTable = action.payload;
    },
    selectTab(state, action) {
      state.currentTab = action.payload;
    },
    setChangedDetailId(state, action) {
      state.changedDetailId = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const { data } = action.payload;
        state.loading = false;
        state.entities = data;
      })

      .addMatcher(isPending(getEntities), state => {
        state.loading = true;
        state.errorMessage = null;
        state.updateSuccess = false;
      });
  },
});
export const { websocketUpdateOrder, selectOrderByTable, selectTab, setChangedDetailId } = OrderSlice.actions;

// Reducer
export default OrderSlice.reducer;
