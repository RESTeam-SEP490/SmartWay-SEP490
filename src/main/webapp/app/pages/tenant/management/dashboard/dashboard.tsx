import React from 'react';

import { Card } from 'antd';
import { RevenueStatistic } from './statistic-component/revenue-statistic';
import { SellingStatistic } from './statistic-component/sell-statistic';
import { ArrowUpOutlined, DollarCircleFilled } from '@ant-design/icons';
import { CurrencyFormat } from 'app/shared/util/currency-utils';
import { IRevenueByTime } from 'app/shared/model/revenue-by-time';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IRevenueStatistic } from 'app/shared/model/revenue-statistic';
import { useEffect } from 'react';
import { getSalesResult } from './dashboard.reduce';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { statisticDTOS }: IRevenueStatistic = useAppSelector(state => state.statistic.salesResult);

  useEffect(() => {
    dispatch(getSalesResult());
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen gap-6 px-6 mt-8">
        <Card>
          <span className="text-lg font-semibold">SALES RESULT TODAY</span>
          <div className="grid grid-cols-3 divide-x divide-slate-200">
            <div className="flex gap-4 p-6 text-base">
              <DollarCircleFilled className="text-3xl text-blue-400" rev="" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500">Revenue</span>
                <div className="flex items-center gap-4">
                  <span className="mb-0 text-lg font-semibold leading-none text-blue-600">
                    <CurrencyFormat>{statisticDTOS[1]?.totalRevenue}</CurrencyFormat>
                  </span>
                  <div className="font-semibold text-green-600">
                    <ArrowUpOutlined rev="" />
                    {(5000000 - 3000000 / 3000000) * 100 + '%'}
                  </div>
                </div>
                <span className="text-sm leading-none text-gray-400">
                  Yesterday <CurrencyFormat>{statisticDTOS[0]?.totalRevenue}</CurrencyFormat>
                </span>
              </div>
            </div>

            <div className="flex gap-4 p-6 text-base">
              <DollarCircleFilled className="text-3xl text-blue-400" rev="" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500">Revenue</span>
                <div className="flex items-center gap-4">
                  <span className="mb-0 text-lg font-semibold leading-none text-blue-600">
                    <CurrencyFormat>5000000</CurrencyFormat>
                  </span>
                  <div className="font-semibold text-green-600">
                    <ArrowUpOutlined rev="" />
                    {(5000000 - 3000000 / 3000000) * 100 + '%'}
                  </div>
                </div>
                <span className="text-sm leading-none text-gray-400">
                  Yesterday <CurrencyFormat>3000000</CurrencyFormat>
                </span>
              </div>
            </div>

            <div className="flex gap-4 p-6 text-base">
              <DollarCircleFilled className="text-3xl text-blue-400" rev="" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500">Revenue</span>
                <div className="flex items-center gap-4">
                  <span className="mb-0 text-lg font-semibold leading-none text-blue-600">
                    <CurrencyFormat>5000000</CurrencyFormat>
                  </span>
                  <div className="font-semibold text-green-600">
                    <ArrowUpOutlined rev="" />
                    {(5000000 - 3000000 / 3000000) * 100 + '%'}
                  </div>
                </div>
                <span className="text-sm leading-none text-gray-400">
                  Yesterday <CurrencyFormat>3000000</CurrencyFormat>
                </span>
              </div>
            </div>
          </div>
        </Card>

        <RevenueStatistic />
        <SellingStatistic />
      </div>
    </>
  );
};
export default Dashboard;
