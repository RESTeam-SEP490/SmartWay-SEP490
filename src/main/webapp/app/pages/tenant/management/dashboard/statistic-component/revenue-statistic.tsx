import { DualAxes } from '@ant-design/charts';
import { RightCircleFilled } from '@ant-design/icons';
import { Card, Select } from 'antd';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IRevenueStatistic } from 'app/shared/model/revenue-statistic';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getRevenueByTime } from '../dashboard.reduce';
import { CurrencyFormat } from 'app/shared/util/currency-utils';

export const RevenueStatistic = () => {
  const dispatch = useAppDispatch();
  const revenuaByTime: IRevenueStatistic = useAppSelector(state => state.statistic.revenueByTime);

  const [revenueChartTime, setRevenueChartTime] = useState({
    startDate: dayjs().weekday(0).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    endDate: dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    type: 'week',
  });

  const revenueConfig = {
    data: [revenuaByTime.statisticDTOS, revenuaByTime.statisticDTOS],
    xField: 'date',
    yField: ['totalRevenue', 'totalOrders'],
    meta: {
      totalRevenue: {
        alias: 'Revenue',
        formatter: num => <CurrencyFormat>{num}</CurrencyFormat>,
      },
      totalOrders: {
        alias: 'Bill amount',
        formatter: num => <CurrencyFormat>{num}</CurrencyFormat>,
      },
      date: {
        formatter: date =>
          dayjs(date).format(
            ['week', 'last-week'].includes(revenueChartTime.type)
              ? 'dddd'
              : ['month', 'last-month'].includes(revenueChartTime.type)
              ? 'DD/MM'
              : 'MM/YYYY'
          ),
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
        color: colors.blue[600],
        columnWidthRatio: 0.5,
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
    dispatch(getRevenueByTime(revenueChartTime));
  }, [revenueChartTime]);

  const onChangeTime = type => {
    if (type === 'week')
      setRevenueChartTime({
        startDate: dayjs().weekday(0).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
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
        startDate: dayjs().weekday(-7).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
        endDate: dayjs().weekday(-1).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
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
        <div className="flex gap-4">
          <span className="text-lg font-semibold">Revenue today</span>
          <span className="flex items-center gap-2 text-xl font-semibold text-green-600">
            <RightCircleFilled className="text-lg text-gray-300" rev="" />
            {revenuaByTime.totalRevenue}
          </span>
        </div>
        <Select className="w-32" value={revenueChartTime.type} onChange={value => onChangeTime(value)}>
          <Select.Option value="week">This week</Select.Option>
          <Select.Option value="last-week">Last week</Select.Option>
          <Select.Option value="month">This month</Select.Option>
          <Select.Option value="last-month">Last month</Select.Option>
          <Select.Option value="year">This Year</Select.Option>
        </Select>
      </div>
      <div className="p-4">
        <DualAxes {...revenueConfig} />
      </div>
    </Card>
  );
};
