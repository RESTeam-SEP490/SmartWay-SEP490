import { createAsyncThunk, createSlice, isFulfilled, isPending } from '@reduxjs/toolkit';
import axios from 'axios';

import { IRevenueStatistic, defaultValue } from 'app/shared/model/revenue-statistic';
import { IItemSellingQuantity } from 'app/shared/model/item-selling-quantity';
import dayjs from 'dayjs';

const initialState = {
  loading: false,
  errorMessage: null,
  revenueByTime: defaultValue,
  salesResult: defaultValue,
  itemsSellingQuantity: [],
  totalItems: 0,
};

const apiUrl = 'api/statistics';

// Actions

export const getRevenueByTime = createAsyncThunk('statistic/get_revenue_by_time', async (dto: { startDate: string; endDate: string }) => {
  const requestUrl = `${apiUrl}/revenue-by-time?startDay=${dto.startDate}&endDay=${dto.endDate}`;
  return axios.get<IRevenueStatistic>(requestUrl);
});

export const getSalesResult = createAsyncThunk('statistic/get_sale_result', async () => {
  const startDate = dayjs().day(1).format('YYYY-MM-DD[T]hh:mm:ss[Z]');
  const endDate = dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]');
  const requestUrl = `${apiUrl}/revenue-by-time?startDay=${endDate}&endDay=${startDate}`;
  return axios.get<IRevenueStatistic>(requestUrl);
});

export const getBestSeller = createAsyncThunk('statistic/get_best_seller', async (dto: { startDate: string; endDate: string }) => {
  const requestUrl = `${apiUrl}/best-sellers?startDay=${dto.startDate}&endDay=${dto.endDate}`;
  return axios.get<IItemSellingQuantity[]>(requestUrl);
});

// slice

export const StatisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getRevenueByTime), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          revenueByTime: data,
        };
      })
      .addMatcher(isFulfilled(getSalesResult), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          salesResult: data,
        };
      })
      .addMatcher(isFulfilled(getBestSeller), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          itemsSellingQuantity: data,
        };
      })
      .addMatcher(isPending(getRevenueByTime, getBestSeller), state => {
        state.errorMessage = null;
        state.loading = true;
      });
  },
});

export const statisticActions = StatisticSlice.actions;

// Reducer
export default StatisticSlice.reducer;
