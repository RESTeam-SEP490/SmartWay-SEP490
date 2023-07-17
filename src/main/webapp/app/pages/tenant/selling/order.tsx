import { AppstoreFilled, FileTextFilled, HomeFilled, ProfileFilled, TableOutlined } from '@ant-design/icons';
import { Col, Menu, Row, Tabs, TabsProps } from 'antd';
import React from 'react';
import { Translate } from 'react-jhipster';
import TableList from './order-screen-components/table-list';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { OrderDetails } from './order-screen-components/order-details';

export const OrderScreen = () => {
  return (
    <div className="flex">
      <Menu mode="vertical" theme="dark" className="bg-blue-600 !text-white !text-lg pt-8" inlineCollapsed>
        <BrandIcon type="white" isHiddenText={true} className="mb-8" />

        <Menu.Item icon={<HomeFilled className="!text-xl" rev={''} />}>Table</Menu.Item>
        <Menu.Item icon={<FileTextFilled className="!text-xl" rev={''} />}>Table</Menu.Item>
      </Menu>
      <div className="grow">
        <TableList />
      </div>
      <div className="max-w-2xl">
        <OrderDetails />
      </div>
    </div>
  );
};
export default OrderScreen;
