import { Card, Empty, Row, Table, Typography } from 'antd';
import Column from 'antd/es/table/Column';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/entities/restaurant/restaurant.reducer';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const listStaffUrl = 'http://localhost:8080/huy/staff';

export const Users = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const userList = useAppSelector(state => state.restaurant.entities);
  const loading = useAppSelector(state => state.restaurant.loading);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    // dispatch(getEntities({}));
    const fetchData = async () => {
      try {
        axios.get(listStaffUrl).then(response => {
          setStaff(response.data);
        });
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  // const users = [
  //   { username: 'a', username1: 1 },
  //   { username: 'a3werwer', username1: 1 },
  // ];

  return (
    <div className="flex h-full p-2">
      <div className="w-1/5 p-4">
        <Card title="Search" bordered={false}></Card>
      </div>
      <div className="w-4/5 p-4">
        <Row>
          <Typography.Title level={3}>
            <Translate contentKey="users.title" />
          </Typography.Title>
        </Row>
        <Table
          dataSource={staff}
          rowSelection={{ type: 'checkbox' }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} /> }}
        >
          {/*<Column title={translate('users.table.columnLabels.username')} dataIndex="username" key="username" />*/}
          {/*<Column title={translate('users.table.columnLabels.username')} dataIndex="username1" key="username1" />*/}
          <Column title="Username" key="username" render={staff => <span>{staff.username}</span>} />
          <Column title="Full Name" key="fullName" render={staff => <span>{staff.fullName}</span>} />
          <Column title="Email" key="email" render={staff => <span>{staff.email}</span>} />
          <Column title="Phone" key="phone" render={staff => <span>{staff.phone}</span>} />
        </Table>
      </div>
    </div>
  );
};
