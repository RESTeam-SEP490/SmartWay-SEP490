import React, { useState } from 'react';

import { Card, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { useEffect } from 'react';
import { getRevenueByTime, statisticActions } from './dashboard.reduce';
import { IRevenueStatistic } from 'app/shared/model/revenue-statistic';
import { RightCircleFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DualAxes } from '@ant-design/charts';
import { colors } from 'app/config/ant-design-theme';
import { weekdays } from 'moment';
import { RevenueStatistic } from './statistic-component/revenue-statistic';

export const Dashboard = () => {
  return (
    <>
      <div className="flex flex-col h-screen gap-6 px-6 mt-8">
        <div className="grid grid-cols-3 gap-4">
          <Card>Stats for today</Card>
          <Card>Stats for today</Card>
          <Card>Stats for today</Card>
        </div>

        <RevenueStatistic />
      </div>
    </>
  );
};
export default Dashboard;
