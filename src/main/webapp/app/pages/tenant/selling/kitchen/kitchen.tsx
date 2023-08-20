import { Tabs, TabsProps } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { AuthenticatedAccountMenu, LocaleMenu } from 'app/shared/layout/menus';
import React, { useEffect } from 'react';
import { translate } from 'react-jhipster';
import { PreparingItems } from './kitchen-screen-components/preparing-items';
import { ReadyToServeItems } from './kitchen-screen-components/ready-to-serve-items';
import { RTSNavTool } from './kitchen-screen-components/ready-to-serve-navtools';
import { getEntities as getKitchenEntities, kitchenActions } from './kitchen.reducer';
import { getEntities as getCategories } from '../../management/menu-item-category/menu-item-category.reducer';

export const Kitchen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(kitchenActions.startConnecting());
    dispatch(getKitchenEntities());
    dispatch(getCategories({}));
    return () => {
      dispatch(kitchenActions.disconnectStomp());
    };
  }, []);

  const preparingItems: TabsProps['items'] = [
    {
      key: 'tableTab',
      label: <div className="flex items-center gap-2 px-4 font-semibold">{translate('kitchen.preparingItems.label')}</div>,
      children: <PreparingItems />,
    },
  ];

  const readyToServeItems: TabsProps['items'] = [
    {
      key: 'tableTab',
      label: <div className="flex items-center gap-2 px-4 font-semibold">{translate('kitchen.rtsItems.label')}</div>,
      children: <ReadyToServeItems />,
    },
  ];

  return (
    <div className="flex">
      <div className="flex w-1/2 h-full pt-4 pr-4 bg-blue-600">
        <Tabs
          items={preparingItems}
          type="card"
          className="grow"
          tabBarExtraContent={
            <div className="flex items-center h-12">
              <RTSNavTool />
            </div>
          }
        ></Tabs>
      </div>
      <div className="flex w-1/2 h-full pt-4 pr-4 bg-blue-600">
        <Tabs
          items={readyToServeItems}
          type="card"
          className="grow"
          tabBarExtraContent={
            <div className="flex h-10 gap-4 mb-2 mr-2">
              <LocaleMenu />
              <div className="flex rounded-lg !text-white -mt-2">
                <AuthenticatedAccountMenu />
              </div>
            </div>
          }
        ></Tabs>
      </div>
    </div>
  );
};
export default Kitchen;
