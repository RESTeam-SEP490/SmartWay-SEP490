import React from 'react';

import { ArrowDownOutlined, ArrowUpOutlined, DollarCircleFilled } from '@ant-design/icons';
import { Card } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IRevenueStatistic } from 'app/shared/model/revenue-statistic';
import { CurrencyFormat } from 'app/shared/util/currency-utils';
import { useEffect } from 'react';
import { MdReceiptLong } from 'react-icons/md';
import { getSalesResult } from './dashboard.reduce';
import RevenueStatistic from './statistic-component/revenue-statistic';
import SellingStatistic from './statistic-component/sell-statistic';

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
          <div className="grid grid-cols-2 divide-x divide-slate-200">
            <div className="flex items-center gap-4 p-6 text-base">
              <DollarCircleFilled className="text-3xl text-yellow-400" rev="" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500">Revenue</span>
                <div className="flex items-center gap-4">
                  <span className="mb-0 text-lg font-semibold leading-none text-yellow-600">
                    <CurrencyFormat>{statisticDTOS[1]?.totalRevenue}</CurrencyFormat>
                  </span>
                  <div
                    className={`font-semibold flex gap-1 ${
                      statisticDTOS[1]?.totalRevenue > statisticDTOS[0]?.totalRevenue
                        ? 'text-green-600'
                        : statisticDTOS[1]?.totalRevenue < statisticDTOS[0]?.totalRevenue
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {statisticDTOS[1]?.totalRevenue < statisticDTOS[0]?.totalRevenue ? (
                      <ArrowDownOutlined rev="" />
                    ) : (
                      <ArrowUpOutlined rev="" />
                    )}
                    {((statisticDTOS[1]?.totalRevenue - statisticDTOS[0]?.totalRevenue) / statisticDTOS[0]?.totalRevenue) * 100 + '%'}
                  </div>
                </div>
                <span className="text-sm leading-none text-gray-400">
                  Yesterday <CurrencyFormat>{statisticDTOS[0]?.totalRevenue}</CurrencyFormat>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 text-base">
              <MdReceiptLong className="text-3xl text-blue-400" />
              <div className="flex flex-col">
                <span className="font-semibold text-gray-500">Bill amount</span>
                <div className="flex items-center gap-4">
                  <span className="mb-0 text-lg font-semibold leading-none text-blue-600">
                    <CurrencyFormat>{statisticDTOS[1]?.totalOrders}</CurrencyFormat>
                  </span>
                  <div
                    className={`font-semibold flex gap-1 ${
                      statisticDTOS[1]?.totalOrders > statisticDTOS[0]?.totalOrders
                        ? 'text-green-600'
                        : statisticDTOS[1]?.totalOrders < statisticDTOS[0]?.totalOrders
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {statisticDTOS[1]?.totalOrders < statisticDTOS[0]?.totalOrders ? (
                      <ArrowDownOutlined rev="" />
                    ) : (
                      <ArrowUpOutlined rev="" />
                    )}
                    {((statisticDTOS[1]?.totalOrders - statisticDTOS[0]?.totalOrders) / statisticDTOS[0]?.totalOrders) * 100 + '%'}
                  </div>
                </div>
                <span className="text-sm leading-none text-gray-400">
                  Yesterday <CurrencyFormat>{statisticDTOS[0]?.totalOrders}</CurrencyFormat>
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
