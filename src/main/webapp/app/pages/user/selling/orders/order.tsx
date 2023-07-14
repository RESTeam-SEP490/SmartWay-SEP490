import { BiRestaurant } from 'react-icons/bi';
import { TableOutlined } from '@ant-design/icons';
import { Col, Row, Tabs, TabsProps } from 'antd';
import React from 'react';
import { Translate } from 'react-jhipster';
import TableList from './order-screen-components/table-list';

const items: TabsProps['items'] = [
  {
    key: 'tableTab',
    label: (
      <div className="px-4 font-semibold">
        <TableOutlined rev={''} />
        <Translate contentKey="global.menu.entities.table" />
      </div>
    ),
    children: <TableList />,
  },
  {
    key: 'menuTab',
    label: (
      <div className="px-4 font-semibold flex items-center">
        <BiRestaurant className="mr-2 text-lg" />
        <Translate contentKey="global.menu.entities.menu" />
      </div>
    ),
    children: <TableList />,
  },
];

export const OrderScreen = () => {
  return (
    <Row>
      <Col span={14} className="p-2">
        <Tabs items={items} type="card"></Tabs>
      </Col>
      <Col span={10}></Col>
    </Row>
  );
};
export default OrderScreen;
