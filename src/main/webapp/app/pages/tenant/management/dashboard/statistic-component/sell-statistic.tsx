import { Bar, Column } from '@ant-design/charts';
import { RightCircleFilled } from '@ant-design/icons';
import { Card, Select } from 'antd';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getBestSeller, getRevenueByTime } from '../dashboard.reduce';
import { IItemSellingQuantity } from 'app/shared/model/item-selling-quantity';
import { currencyFormat } from 'app/shared/util/currency-utils';
import { IMenuItem } from 'app/shared/model/menu-item.model';

export const SellingStatistic = () => {
  const dispatch = useAppDispatch();
  const itemsSellingQuantity: IItemSellingQuantity[] = useAppSelector(state => state.statistic.itemsSellingQuantity);
  const { currencyUnit } = useAppSelector(state => state.restaurant.restaurant);
  const localeKey = currencyUnit === 'VND' ? 'vi-VN' : currencyUnit === 'USD' ? 'en-US' : '';

  const [revenueChartTime, setRevenueChartTime] = useState({
    startDate: dayjs().day(-6).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    endDate: dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    type: 'week',
  });

  const [isByRevenue, setIsByRevenue] = useState(true);

  const data = [...itemsSellingQuantity]
    .sort((a, b) => (isByRevenue ? (a.revenue > b.revenue ? -1 : 1) : a.quantity > b.quantity ? -1 : 1))
    .map((i: IItemSellingQuantity) => {
      return { x: isByRevenue ? i.revenue : i.quantity, name: i.menuItem.name, id: i.menuItem.id };
    });

  const bestSeller = data[0];

  const config = {
    data,
    yField: 'name',
    xField: 'x',
    maxBarWidth: 50,
    meta: {
      x: {
        alias: isByRevenue ? 'Revenue' : 'Quantity',
        formatter: x => (isByRevenue ? currencyFormat(x, localeKey) : x),
      },
      name: {
        alias: 'Menu item',
      },
    },
  };

  useEffect(() => {
    dispatch(getBestSeller(revenueChartTime));
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
        <div className="flex items-center">
          <span className="mb-0.5 text-lg font-semibold">SELLING STATISTIC</span>
          <Select
            className="text-lg !text-blue-600 w-fit statistic"
            defaultValue={true}
            bordered={false}
            onChange={value => setIsByRevenue(value)}
          >
            <Select.Option value={true}>BY REVENUE</Select.Option>
            <Select.Option value={false}>BY QUANTITY</Select.Option>
          </Select>
        </div>
        <Select size="large" className="w-40 !pl-1 text-lg" value={revenueChartTime.type} onChange={value => onChangeTime(value)}>
          <Select.Option value="week">This week</Select.Option>
          <Select.Option value="last-week">Last week</Select.Option>
          <Select.Option value="month">This month</Select.Option>
          <Select.Option value="last-month">Last month</Select.Option>
          <Select.Option value="year">This Year</Select.Option>
        </Select>
      </div>
      <div className="p-4 pt-8">
        <Bar {...config} isGroup={true} />
      </div>
    </Card>
  );
};
