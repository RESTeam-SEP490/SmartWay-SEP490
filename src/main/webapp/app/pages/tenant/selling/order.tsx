import { FileTextFilled, HomeFilled, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Menu, Tabs, TabsProps } from 'antd';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import React, { useEffect, useState } from 'react';
import { OrderDetails } from './order-screen-components/order-details';
import TableList from './order-screen-components/table-list';
import { Storage, Translate } from 'react-jhipster';
import { MdFastfood, MdOutlineDisplaySettings, MdOutlineTune, MdTableRestaurant } from 'react-icons/md';
import { MenuItemList } from './order-screen-components/menu-item-list';
import { getEntities as getCategories } from '../management/menu-item-category/menu-item-category.reducer';
import { getEntities as getMenuItems, setPageable } from '../management/menu-item/menu-item.reducer';
import { useAppDispatch } from 'app/config/store';
import { DEFAULT_PAGEABLE } from '../../../app.constant';

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

  const [isCollapse, setIsCollapse] = useState(Storage.local.get('isCollapse', true));

  const handleCollapse = () => {
    Storage.local.set('isCollapse', !isCollapse);
    setIsCollapse(!isCollapse);
  };

  useEffect(() => {
    dispatch(setPageable({ ...DEFAULT_PAGEABLE, size: 10000, isActive: true }));
    dispatch(getMenuItems());
    dispatch(getCategories({}));
  }, []);

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
        <OrderDetails />
      </div>
    </div>
  );
};
export default OrderScreen;
