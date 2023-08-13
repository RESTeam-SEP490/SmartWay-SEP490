import { Bar } from '@ant-design/charts';
import { RightCircleFilled } from '@ant-design/icons';
import { Card, Select } from 'antd';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { getBestSeller, getRevenueByTime } from '../dashboard.reduce';
import { IItemSellingQuantity } from 'app/shared/model/item-selling-quantity';

export const SellingStatistic = () => {
  const dispatch = useAppDispatch();
  const itemsSellingQuantity: IItemSellingQuantity[] = useAppSelector(state => state.statistic.itemsSellingQuantity);

  const [revenueChartTime, setRevenueChartTime] = useState({
    startDate: dayjs().weekday(0).format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    endDate: dayjs().format('YYYY-MM-DD[T]hh:mm:ss[Z]'),
    type: 'week',
  });

  const revenueConfig = {
    data: itemsSellingQuantity.map((i: IItemSellingQuantity, index) => ({
      name: i.menuItem.name,
      quantity: i.quantity,
      isBestSeller: index === 0,
    })),

    xField: 'quantity',
    yField: 'name',
    color({ isBestSeller }) {
      return isBestSeller ? colors.yellow[600] : colors.blue[600];
    },
    barWidthMax: 50,
    legend: false,
    seriesField: 'isBestSeller',
    meta: {
      quantity: {
        alias: 'Quantity',
      },
      name: {
        alias: 'Name',
      },
    },
    interactions: [
      {
        type: 'element-highlight',
      },
    ],
  };

  useEffect(() => {
    dispatch(getBestSeller(revenueChartTime));
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
          <span className="text-lg font-semibold">Selling statistic</span>
          <span className="flex items-center gap-2 text-xl font-semibold text-green-600">
            <RightCircleFilled className="text-lg text-gray-300" rev="" />
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
        <Bar {...revenueConfig} />
      </div>
    </Card>
  );
};
