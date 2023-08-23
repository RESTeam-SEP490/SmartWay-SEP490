import { RightCircleFilled } from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import { Card, Select } from 'antd';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ICancellationStatistic } from 'app/shared/model/canccellation-statistic';
import { currencyFormat } from 'app/shared/util/currency-utils';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getCancellationStatistic } from '../dashboard.reduce';

export const CancellationStatistic = () => {
  const dispatch = useAppDispatch();
  const cancellationStatisticList: ICancellationStatistic[] = useAppSelector(state => state.statistic.cancellationStatistic);
  const data = [];
  cancellationStatisticList.map(c => {
    data.push(
      { date: c.date, value: c.customerUnsatisfiedQuantity, reason: 'Customer unsatisfied with items' },
      { date: c.date, value: c.exchangeItemQuantity, reason: 'Customer changed their order' },
      { date: c.date, value: c.longWaitingTimeQuantity, reason: 'Customer waited for a long time' },
      { date: c.date, value: c.outOfStockQuantity, reason: 'Item is unavailable' },
      { date: c.date, value: c.othersQuantity, reason: 'Others' }
    );
  });

  const { currencyUnit } = useAppSelector(state => state.restaurant.restaurant);
  const localeKey = currencyUnit === 'VND' ? 'vi-VN' : currencyUnit === 'USD' ? 'en-US' : '';

  const [revenueChartTime, setRevenueChartTime] = useState({
    startDate: dayjs().day(-6).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    endDate: dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    type: 'week',
  });

  const revenueConfig = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'reason',
    meta: {
      totalRevenue: {
        alias: 'Revenue',
        formatter: num => currencyFormat(num, localeKey),
      },
      totalOrders: {
        alias: 'Bill amount',
        formatter: num => currencyFormat(num, localeKey),
      },
      date: {
        formatter: date =>
          dayjs(date)
            .format(
              ['week', 'last-week'].includes(revenueChartTime.type)
                ? 'dddd'
                : ['month', 'last-month'].includes(revenueChartTime.type)
                ? 'DD/MM'
                : 'MM/YYYY'
            )
            .toUpperCase(),
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
        color: colors.blue[600],
        maxColumnWidth: 80,
        minColumnWidth: 20,
        label: {
          style: {},
        },
      },
      {
        geometry: 'line',
        smooth: true,
        color: colors.yellow[600],
      },
    ],
    interactions: [
      {
        type: 'element-highlight',
      },
      {
        type: 'active-region',
      },
    ],
  };

  useEffect(() => {
    dispatch(getCancellationStatistic(revenueChartTime));
  }, [revenueChartTime]);

  const onChangeTime = type => {
    if (type === 'week')
      setRevenueChartTime({
        startDate: dayjs().day(-6).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        type,
      });
    else if (type === 'month')
      setRevenueChartTime({
        startDate: dayjs().date(1).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        type,
      });
    else if (type === 'year')
      setRevenueChartTime({
        startDate: dayjs().dayOfYear(1).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        endDate: dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        type,
      });
    else if (type === 'last-week')
      setRevenueChartTime({
        startDate: dayjs().day(-13).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        endDate: dayjs().day(-7).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        type,
      });
    else if (type === 'last-month')
      setRevenueChartTime({
        startDate: dayjs().date(-30).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        endDate: dayjs().date(-1).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        type,
      });
  };

  return (
    <Card>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">{`REVENUE STATISTIC ${
            revenueChartTime.type.includes('-')
              ? revenueChartTime.type.replace('-', ' ').toUpperCase()
              : 'THIS ' + revenueChartTime.type.toUpperCase()
          }`}</span>
          <span className="flex items-center gap-2 text-xl font-semibold text-green-600">
            <RightCircleFilled className="text-lg text-gray-300" rev="" />
            {}
          </span>
        </div>
        <Select className="w-32" value={revenueChartTime.type} onChange={value => onChangeTime(value)}>
          <Select.Option value="week">This week</Select.Option>
          <Select.Option value="last-week">Last week</Select.Option>
          <Select.Option value="month">This month</Select.Option>
          <Select.Option value="last-month">Last month</Select.Option>
          <Select.Option value="year">This Year</Select.Option>
          <Select.Option value="custom">Custom</Select.Option>
        </Select>
      </div>
      <div className="p-4">
        <Line {...revenueConfig} />
      </div>
    </Card>
  );
};

export default CancellationStatistic;
