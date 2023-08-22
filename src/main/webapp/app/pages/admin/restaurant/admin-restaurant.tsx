import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { translate, Translate } from 'react-jhipster';
import { getEntities, setPageable } from 'app/pages/admin/restaurant/admin-restaurnat.reducer';
import { Button, Card, Dropdown, Empty, Input, MenuProps, Radio, Table, Tag, Typography } from 'antd';
import { DEFAULT_PAGINATION_CONFIG } from 'app/shared/util/pagination.constants';
import { IAdminRestaurant } from 'app/shared/model/adminRestaurant';
import { format } from 'date-fns';
import AdminRestaurantDetail from 'app/pages/admin/restaurant/admin-restaurant-detail';
import AdminRestaurantDialog from 'app/pages/admin/restaurant/admin-restaurant-dialog';
import { BarsOutlined } from '@ant-design/icons';

export const AdminRestaurant = () => {
  const dispatch = useAppDispatch();
  const items: MenuProps['items'] = [
    {
      key: '2',
      label: (
        <div onClick={() => handleUpdateIsActive(true)}>
          <Translate contentKey="restaurant.action.allowSell" />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={() => handleUpdateIsActive(false)}>
          <Translate contentKey="restaurant.action.stopSell" />
        </div>
      ),
    },
  ];

  const columns = [
    { title: <Translate contentKey="restaurant.id" />, dataIndex: 'id', key: 'id' },
    { title: <Translate contentKey="restaurant.name" />, dataIndex: 'name', key: 'name' },
    { title: <Translate contentKey="restaurant.currencyUnit" />, dataIndex: 'currencyUnit', key: 'currencyUnit' },
    { title: <Translate contentKey="restaurant.phone" />, dataIndex: 'phone', key: 'phone' },
    {
      title: <Translate contentKey="restaurant.planExpiry" />,
      dataIndex: 'planExpiry',
      key: 'planExpiry',
      render: (text, record) => {
        return format(new Date(text), 'dd-MM-yyyy');
      },
    },
    { title: <Translate contentKey="restaurant.langKey" />, dataIndex: 'langKey', key: 'langKey' },
    {
      title: <Translate contentKey="restaurant.isActive" />,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (i: boolean) => <Translate contentKey={i ? 'menuItem.status.trueValue' : 'menuItem.status.falseValue'} />,
    },
  ];

  const [expendedRow, setExpendedRow] = useState();

  const [isShowDialog, setIsShowDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IAdminRestaurant[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [allowSale, setAllowSale] = useState<boolean>();
  const restaurantList = useAppSelector(state => state.adminRestaurant.entities);
  const pageable = useAppSelector(state => state.adminRestaurant.pageable);
  const count = useAppSelector(state => state.adminRestaurant.totalItems);
  const loading = useAppSelector(state => state.adminRestaurant.loading);
  const updateSuccess = useAppSelector(state => state.adminRestaurant.updateSuccess);
  const [isShowForm, setIsShowForm] = useState(false);
  const [updatingRestaurant, setUpdatingRestaurant] = useState<IAdminRestaurant>();

  useEffect(() => {
    dispatch(getEntities());
  }, [pageable]);
  console.log(restaurantList);
  useEffect(() => {
    if (selectedItems.length > 0 && updateSuccess) {
      setSelectedRowKeys([]);
      setSelectedItems([]);
    }
  }, [updateSuccess]);

  const handleOnchangePage = (page, pageSize) => {
    dispatch(setPageable({ ...pageable, page: page - 1, size: pageSize }));
  };

  const handleOnchangeSearch = e => {
    const search = e.target.value;
    if (search !== pageable.search) dispatch(setPageable({ ...pageable, page: 0, search }));
  };

  const onSelectRow = ({ id }, selected) => {
    if (selected) setSelectedRowKeys(prev => [...prev, id]);
    else {
      const nextSelectedRowKeys = [...selectedRowKeys];
      const removeIndex = nextSelectedRowKeys.findIndex(k => k === id);
      nextSelectedRowKeys.splice(removeIndex, 1);
      setSelectedRowKeys(nextSelectedRowKeys);
    }
  };

  const onSelectAllRows = (selected: boolean, selectedRows: { id: any }[], changeRows: { id: any }[]) => {
    if (selected) {
      const changeRowKeys = selectedRows.filter(r => r).map(r => r.id);
      setSelectedRowKeys(prev => [...new Set([...prev, ...changeRowKeys])]);
    } else {
      const changeRowKeys = changeRows.map(r => r.id);
      setSelectedRowKeys(prev => prev.filter(k => !changeRowKeys.includes(k)));
    }
  };

  const handleResetSelectedRowKey = e => {
    e.preventDefault();
    setSelectedRowKeys([]);
  };

  const handleOpen = (item: IAdminRestaurant) => {
    setUpdatingRestaurant(item);
    setIsShowForm(true);
  };

  const handleUpdateIsActive = (isActive: boolean) => {
    const nextSelectedItems = selectedRowKeys.map(key => {
      const r: IAdminRestaurant = { id: key + '' };
      return r;
    });
    console.log(nextSelectedItems);
    setSelectedItems(nextSelectedItems);
    setAllowSale(isActive);
    setIsShowDialog(true);
  };

  const handleOnchangeStatusFilter = e => {
    dispatch(setPageable({ ...pageable, page: 0, isActive: e.target.value }));
  };

  const formattedRestaurantList = restaurantList.map(record => {
    const formattedPlanExpiry = format(new Date(record.planExpiry), 'dd-MM-yyyy');

    return {
      ...record,
      planExpiry: formattedPlanExpiry,
    };
  });

  return (
    <>
      <AdminRestaurantDialog
        adminRestaurant={selectedItems}
        isOpen={isShowDialog}
        handleClose={() => setIsShowDialog(false)}
        isActive={allowSale}
      />
      <div className="flex h-full p-2">
        <div className="flex flex-col w-1/5 gap-4 p-4">
          <Card>
            <Typography.Title level={5}>
              <Translate contentKey="entity.action.find" />
            </Typography.Title>
            <Input placeholder={translate('restaurant.search.placeholder')} onPressEnter={handleOnchangeSearch} />
          </Card>
          <Card>
            <Typography.Title level={5}>
              <Translate contentKey="entity.label.status" />
            </Typography.Title>
            <Radio.Group className="flex flex-col gap-2" defaultValue={true} onChange={handleOnchangeStatusFilter}>
              <Radio className="!font-normal" value={true}>
                <Translate contentKey="restaurant.status.trueValue" />
              </Radio>
              <Radio className="!font-normal" value={false}>
                <Translate contentKey="restaurant.status.falseValue" />
              </Radio>
              <Radio className="!font-normal" value={undefined}>
                <Translate contentKey="entity.label.all" />
              </Radio>
            </Radio.Group>
          </Card>
        </div>

        <div className="w-4/5 p-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Typography.Title level={3} className="!mb-0">
                  <Translate contentKey="restaurant.title" />
                </Typography.Title>
                {selectedRowKeys.length > 0 && (
                  <Tag className="px-4 py-1" closable color="blue" onClose={handleResetSelectedRowKey}>
                    <Translate contentKey="entity.action.select" interpolate={{ number: selectedRowKeys.length }} />
                  </Tag>
                )}
              </div>
              <div className="flex gap-2">
                <Dropdown menu={{ items }} disabled={selectedRowKeys.length === 0} className="!w-32">
                  <Button type="primary" icon={<BarsOutlined rev={''} />}>
                    <Translate contentKey="entity.label.operations" />
                  </Button>
                </Dropdown>
              </div>
            </div>
            <Table
              columns={columns.map(s => ({ ...s, ellipsis: true }))}
              dataSource={formattedRestaurantList}
              pagination={{
                ...DEFAULT_PAGINATION_CONFIG,
                onChange: handleOnchangePage,
                total: count,
                current: pageable.page + 1,
                locale: { items_per_page: '/ ' + translate('global.table.pageText') },
              }}
              scroll={{ x: true }}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys,
                onSelect: onSelectRow,
                onSelectAll: onSelectAllRows,
              }}
              rowKey={'id'}
              rowClassName={'cursor-pointer'}
              loading={loading}
              expandable={{
                expandedRowRender: record => <AdminRestaurantDetail adminRestaurant={record} onUpdate={() => handleOpen(record)} />,
                expandedRowClassName: () => '!bg-white',
                expandRowByClick: true,
                expandIcon: () => <></>,
                expandedRowKeys: [expendedRow],
                onExpand(expended, record) {
                  if (expended) setExpendedRow(record.id);
                  else setExpendedRow(undefined);
                },
              }}
              locale={{
                emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />,
              }}
            ></Table>
          </Card>
        </div>
      </div>
    </>
  );
};
