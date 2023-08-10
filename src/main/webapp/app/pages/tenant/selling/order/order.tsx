import { Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { MdFastfood, MdShoppingBag, MdTableRestaurant } from 'react-icons/md';
import { Translate } from 'react-jhipster';
import { DEFAULT_PAGEABLE } from '../../../../app.constant';
import { getEntities as getTables, setPageable as setTablePageable } from '../../management/dining-table/dining-table.reducer';
import { getEntities as getCategories } from '../../management/menu-item-category/menu-item-category.reducer';
import { getEntities as getBankAccoutInfo } from '../../check-bank-account-tenant/check-bank-account-tenant.reducer';
import { getEntities as getMenuItems, setPageable as setItemPageable } from '../../management/menu-item/menu-item.reducer';
import { getEntities as getOrders, orderActions } from '../../selling/order/order.reducer';
import { MenuItemList } from './order-screen-components/menu-item-list';
import { OrderDetails } from './order-screen-components/order-details';
import TableList from './order-screen-components/table-list';
import '../../../../../content/css/loading.css';
import { TakeAwayOrderList } from './order-screen-components/take-away-order-list';

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
    key: 'takeaway',
    label: (
      <div className="flex items-center gap-2 px-4 font-semibold">
        <MdShoppingBag size={24} />
        <Translate contentKey="global.menu.entities.takeaway" />
      </div>
    ),
    children: <TakeAwayOrderList />,
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

  const loading = useAppSelector(state => state.order.loading);
  const updating = useAppSelector(state => state.order.updating);

  useEffect(() => {
    dispatch(orderActions.startConnecting());
    dispatch(setItemPageable({ ...DEFAULT_PAGEABLE, sort: 'createdDate,ASC', size: 10000, isActive: true }));
    dispatch(setTablePageable({ ...DEFAULT_PAGEABLE, sort: 'createdDate,ASC', size: 10000, isActive: true }));
    dispatch(getMenuItems());
    dispatch(getTables());
    dispatch(getCategories({}));
    dispatch(getOrders());
    dispatch(getBankAccoutInfo());

    return () => {
      dispatch(orderActions.disconnectStomp());
    };
  }, []);

  return (
    <>
      <div
        hidden={!updating && !loading}
        className="fixed transition-opacity duration-1000 bg-white bg-opacity-70 top-0 bottom-0 left-0 right-0 z-[5000]"
      >
        <div className="app-loading">
          <div className="image-loading"></div>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="pt-2 pr-4 bg-blue-600 grow">
          <Tabs items={items} type="card" className="flex-none"></Tabs>
        </div>
        <div className="">
          <OrderDetails />
        </div>
      </div>
    </>
  );
};
export default OrderScreen;
