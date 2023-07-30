import { Button, Menu, Tabs, TabsProps } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { IOrder, defaultValue } from 'app/shared/model/order.model';
import React, { useEffect, useState } from 'react';
import { MdFastfood, MdOutlineDisplaySettings, MdOutlineTune, MdTableRestaurant } from 'react-icons/md';
import { Storage, Translate } from 'react-jhipster';
import { DEFAULT_PAGEABLE } from '../../../../app.constant';
import { getEntities as getTables, setPageable as setTablePageable } from '../../management/dining-table/dining-table.reducer';
import { getEntities as getCategories } from '../../management/menu-item-category/menu-item-category.reducer';
import { getEntities as getMenuItems, setPageable as setItemPageable } from '../../management/menu-item/menu-item.reducer';
import { getEntities as getOrders } from '../../selling/order/order.reducer';
import { MenuItemList } from './order-screen-components/menu-item-list';
import { OrderDetails } from './order-screen-components/order-details';
import TableList from './order-screen-components/table-list';
import { connectOrderWebSocket } from './order.websocket';

export const OrderScreen = () => {
  const dispatch = useAppDispatch();

  const [isCollapse, setIsCollapse] = useState(Storage.local.get('isCollapse', true));

  const handleCollapse = () => {
    Storage.local.set('isCollapse', !isCollapse);
    setIsCollapse(!isCollapse);
  };

  const selectedTable = useAppSelector(state => state.order.selectedTable);
  const orders: IOrder[] = useAppSelector(state => state.order.entities);

  const [currentOrder, setCurrentOrder] = useState(defaultValue);

  useEffect(() => {
    let nextCurrentOrder = orders.find(o => o.table.id === selectedTable.id);
    if (!nextCurrentOrder) nextCurrentOrder = { ...defaultValue, table: selectedTable };
    setCurrentOrder(nextCurrentOrder);
  }, [orders, selectedTable]);

  useEffect(() => {
    dispatch(setItemPageable({ ...DEFAULT_PAGEABLE, sort: 'createdDate,ASC', size: 10000, isActive: true }));
    dispatch(setTablePageable({ ...DEFAULT_PAGEABLE, sort: 'createdDate,ASC', size: 10000, isActive: true }));
    dispatch(getMenuItems());
    dispatch(getTables());
    dispatch(getCategories({}));
    dispatch(getOrders());
    connectOrderWebSocket();
  }, []);

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
      children: <MenuItemList currentOrder={currentOrder} />,
    },
  ];

  return (
    <div className="flex h-full">
      <div
        className={` bg-blue-600 flex flex-col pt-2 justify-between transition-all duration-300 ease-in-collapse ${
          isCollapse ? 'w-20' : '!w-48'
        }`}
      >
        <div className="">
          <div className="px-3">
            <BrandIcon type="white" isHiddenText={isCollapse} />
          </div>
          <Menu mode="inline" theme="dark" className="bg-blue-600 !text-white pt-4" inlineCollapsed={isCollapse}>
            <Menu.Item icon={<MdOutlineDisplaySettings size={24} />}>Table</Menu.Item>
            {/* <Menu.Item icon={<FileTextOutlined className="!text-xl" rev={''} />}>Table</Menu.Item> */}
          </Menu>
        </div>
        <div className="h-16 mx-4 border-0 border-t border-solid border-slate-200 ">
          <Button onClick={handleCollapse} type="primary" className="!shadow-none px-1 float-right mr-2 my-4">
            <MdOutlineTune size={24} />
          </Button>
        </div>
      </div>{' '}
      <div className="flex pt-2 pr-4 bg-blue-600 grow">
        <Tabs items={items} type="card" className="grow"></Tabs>
      </div>
      <div className="">
        <OrderDetails currentOrder={currentOrder} />
      </div>
    </div>
  );
};
export default OrderScreen;
