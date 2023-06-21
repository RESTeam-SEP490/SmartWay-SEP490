import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Button, Card, Empty, Row, Table, Typography } from 'antd';
import { DEFAULT_PAGEABLE } from '../../app.constant';
import { getEntities } from './menu-item.reducer';
import MenuItemDetail from './menu-item-detail';
import menuItem from 'app/entities/menu-item/menu-item.reducer';

export const MenuItem = () => {
  const dispatch = useAppDispatch();

  const columns = [
    { title: <Translate contentKey="menuItem.name" />, dataIndex: 'name', key: 'name' },
    { title: <Translate contentKey="menuItem.category" />, dataIndex: ['menuItemCategory', 'name'], key: 'menuItemCategory' },
    { title: <Translate contentKey="menuItem.basePrice" />, dataIndex: 'basePrice', key: 'basePrice' },
    { title: <Translate contentKey="menuItem.sellPrice" />, dataIndex: 'sellPrice', key: 'sellPrice' },
  ];

  const [expendedRow, setExpendedRow] = useState();

  const location = useLocation();
  const navigate = useNavigate();

  const menuItemList = useAppSelector(state => state.menuItem.entities);
  const loading = useAppSelector(state => state.menuItem.loading);

  useEffect(() => {
    dispatch(getEntities(DEFAULT_PAGEABLE));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities(DEFAULT_PAGEABLE));
  };

  return (
    <>
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
            size="small"
            columns={columns}
            dataSource={menuItemList}
            rowSelection={{ type: 'checkbox' }}
            rowKey={'id'}
            rowClassName={'cursor-pointer'}
            loading={loading}
            expandable={{
              expandedRowRender: record => <MenuItemDetail menuItem={record} />,
              expandedRowClassName: () => '!bg-white',
              expandRowByClick: true,
              expandIcon: () => <></>,
              expandedRowKeys: [expendedRow],
              onExpand(expended, record) {
                if (expended) setExpendedRow(record.id);
                else setExpendedRow(undefined);
              },
            }}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} /> }}
          ></Table>
        </div>
      </div>

      <div className="hidden">
        <h2 id="restaurant-heading" data-cy="RestaurantHeading">
          <Translate contentKey="smartWayApp.restaurant.home.title">Restaurants</Translate>
          <div className="d-flex justify-content-end">
            <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
              <FontAwesomeIcon icon="sync" spin={loading} />{' '}
              <Translate contentKey="smartWayApp.restaurant.home.refreshListLabel">Refresh List</Translate>
            </Button>
            <Link to="/restaurant/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
              <FontAwesomeIcon icon="plus" />
              &nbsp;
              <Translate contentKey="smartWayApp.restaurant.home.createLabel">Create new Restaurant</Translate>
            </Link>
          </div>
        </h2>
        <div className="table-responsive">
          {menuItemList && menuItemList.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>
                    <Translate contentKey="smartWayApp.restaurant.id">ID</Translate>
                  </th>
                  <th>
                    <Translate contentKey="smartWayApp.restaurant.name">Name</Translate>
                  </th>
                  <th>
                    <Translate contentKey="smartWayApp.restaurant.email">Email</Translate>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {menuItemList.map((restaurant, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      {/* <Button tag={Link} to={`/restaurant/${restaurant.id}`} color="link" size="sm">
                        {restaurant.id}
                      </Button> */}
                    </td>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.email}</td>
                    <td className="text-end">
                      <div className="btn-group flex-btn-group-container">
                        {/* <Button tag={Link} to={`/restaurant/${restaurant.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.view">View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`/restaurant/${restaurant.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.edit">Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`/restaurant/${restaurant.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">
                            <Translate contentKey="entity.action.delete">Delete</Translate>
                          </span>
                        </Button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            !loading && (
              <div className="alert alert-warning">
                <Translate contentKey="smartWayApp.restaurant.home.notFound">No Restaurants found</Translate>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MenuItem;
