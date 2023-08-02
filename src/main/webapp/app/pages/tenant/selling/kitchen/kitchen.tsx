import { Tabs, TabsProps, Typography } from 'antd';
import { useAppDispatch } from 'app/config/store';
import React, { useEffect } from 'react';
import { orderActions } from '../order/order.reducer';
import { kitchenActions, getEntities } from './kitchen.reducer';
import { PreparingItems } from './kitchen-screen-components/preparing-items';

const items: TabsProps['items'] = [
  {
    key: 'tableTab',
    label: <div className="flex items-center gap-2 px-4 font-semibold">Preparing items</div>,
    children: <PreparingItems />,
  },
];

export const Kitchen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntities());
  }, []);

  return (
    <div className="flex">
      <div className="flex w-1/2 h-screen pt-2 pr-4 bg-blue-600">
        <Tabs items={items} type="card" className="grow"></Tabs>
      </div>
      <div className=""></div>
    </div>
  );
};
export default Kitchen;
