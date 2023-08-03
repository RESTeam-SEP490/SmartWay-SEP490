import { Tabs, TabsProps } from 'antd';
import { useAppDispatch } from 'app/config/store';
import React, { useEffect } from 'react';
import { getEntities, kitchenActions } from './kitchen.reducer';
import { PreparingItems } from './kitchen-screen-components/preparing-items';
import { ReadyToServeItems } from './kitchen-screen-components/ready-to-serve-items';

const preparingItems: TabsProps['items'] = [
  {
    key: 'tableTab',
    label: <div className="flex items-center gap-2 px-4 font-semibold">Preparing items</div>,
    children: <PreparingItems />,
  },
];

const readyToServeItems: TabsProps['items'] = [
  {
    key: 'tableTab',
    label: <div className="flex items-center gap-2 px-4 font-semibold">Ready-to-serve items</div>,
    children: <ReadyToServeItems />,
  },
];

export const Kitchen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(kitchenActions.startConnecting());
    dispatch(getEntities());
    return () => {
      dispatch(kitchenActions.disconnectStomp());
    };
  }, []);

  return (
    <div className="flex">
      <div className="flex w-1/2 h-screen pt-2 pr-4 bg-blue-600">
        <Tabs items={preparingItems} type="card" className="grow"></Tabs>
      </div>
      <div className="flex w-1/2 h-screen pt-2 pr-4 bg-blue-600">
        <Tabs items={readyToServeItems} type="card" className="grow"></Tabs>
      </div>
    </div>
  );
};
export default Kitchen;
