import { Tabs, TabsProps } from 'antd';
import { useAppDispatch } from 'app/config/store';
import React, { useEffect } from 'react';
import { MdFastfood, MdTableRestaurant } from 'react-icons/md';
import { Translate } from 'react-jhipster';
import { DEFAULT_PAGEABLE } from '../../../../app.constant';
import { getEntities as getTables, setPageable as setTablePageable } from '../../management/dining-table/dining-table.reducer';
import { getEntities as getCategories } from '../../management/menu-item-category/menu-item-category.reducer';
import { getEntities as getMenuItems, setPageable as setItemPageable } from '../../management/menu-item/menu-item.reducer';
import { getEntities as getOrders, orderActions } from '../../selling/order/order.reducer';
import { MenuItemList } from './order-screen-components/menu-item-list';
import { OrderDetails } from './order-screen-components/order-details';
import TableList from './order-screen-components/table-list';

const items: TabsProps['items'] = [
  {
    key: 'tableTab',
    label: (
      <div className="flex items-center gap-2 px-4 font-semibold">
        <MdTableRestaurant size={24} />
        <Translate contentKey="global.menu.entities.table" />
      </div>
    ),
    children: <TableList />,
  },
  {
    key: 'menuTab',
    label: (
      <div className="flex items-center gap-2 px-4 font-semibold">
        <MdFastfood size={24} />
        <Translate contentKey="global.menu.entities.menu" />
      </div>
    ),
    children: <MenuItemList />,
  },
];

export const OrderScreen = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(orderActions.startConnecting());
    dispatch(setItemPageable({ ...DEFAULT_PAGEABLE, sort: 'createdDate,ASC', size: 10000, isActive: true }));
    dispatch(setTablePageable({ ...DEFAULT_PAGEABLE, sort: 'createdDate,ASC', size: 10000, isActive: true }));
    dispatch(getMenuItems());
    dispatch(getTables());
    dispatch(getCategories({}));
    dispatch(getOrders());

    return () => {
      dispatch(orderActions.disconnectStomp());
    };
  }, []);

  return (
    <div className="flex">
      <div className="flex pt-2 pr-4 bg-blue-600 grow">
        <Tabs items={items} type="card" className="grow"></Tabs>
      </div>
      <div className="">
        <OrderDetails />
      </div>
    </div>
  );
};
export default OrderScreen;
