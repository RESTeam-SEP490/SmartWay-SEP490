import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';
import axios from 'axios';

import { ICancellationStatistic, defaultValue as defaultCancellationStatistic } from 'app/shared/model/canccellation-statistic';
import { IItemSellingQuantity } from 'app/shared/model/item-selling-quantity';
import { IRevenueStatistic, defaultValue } from 'app/shared/model/revenue-statistic';
import dayjs from 'dayjs';

const initialState = {
  loading: false,
  errorMessage: null,
  revenueByTime: defaultValue,
  salesResult: defaultValue,
  cancellationStatistic: [],
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
  const startDate = dayjs().subtract(1, 'day').utc().format().replace('+00:00', 'Z');
  const endDate = dayjs().utc().format().replace('+00:00', 'Z');
  const requestUrl = `${apiUrl}/revenue-by-time?startDay=${startDate}&endDay=${endDate}`;
  return axios.get<IRevenueStatistic>(requestUrl);
});

export const getBestSeller = createAsyncThunk('statistic/get_best_seller', async (dto: { startDate: string; endDate: string }) => {
  const requestUrl = `${apiUrl}/best-sellers?startDay=${dto.startDate}&endDay=${dto.endDate}`;
  return axios.get<IItemSellingQuantity[]>(requestUrl);
});

export const getCancellationStatistic = createAsyncThunk(
  'statistic/get_cancellation_statistic',
  async (dto: { startDate: string; endDate: string }) => {
    const requestUrl = `${apiUrl}/cancel-items?startDay=${dto.startDate}&endDay=${dto.endDate}`;
    return axios.get<ICancellationStatistic[]>(requestUrl);
  }
);

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
      .addMatcher(isFulfilled(getCancellationStatistic), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          cancellationStatistic: data,
        };
      })
      .addMatcher(isPending(getRevenueByTime, getBestSeller, getCancellationStatistic), state => {
        state.errorMessage = null;
        state.loading = true;
      })
      .addMatcher(isRejected(getRevenueByTime, getBestSeller, getCancellationStatistic), state => {
        state.loading = false;
      });
  },
});

export const statisticActions = StatisticSlice.actions;

// Reducer
export default StatisticSlice.reducer;
