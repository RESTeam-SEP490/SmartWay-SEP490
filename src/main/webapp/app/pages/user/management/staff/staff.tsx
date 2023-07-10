import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { translate, Translate } from 'react-jhipster';
import { IStaff } from 'app/shared/model/staff.model';
import { Button, Card, Dropdown, Empty, Input, Radio, Table, Tag, Typography } from 'antd';
import { DEFAULT_PAGINATION_CONFIG } from 'app/shared/util/pagination.constants';
import { getEntities, setPageable } from 'app/pages/user/management/staff/staff.reducer';

export const Staff = () => {
  const dispatch = useAppDispatch();

  const columns = [
    { title: <Translate contentKey="staff.username.label" />, dataIndex: 'username', key: 'username' },
    { title: <Translate contentKey="staff.fullName.label" />, dataIndex: 'fullName', key: 'fullName' },
    { title: <Translate contentKey="staff.phone.label" />, dataIndex: 'phone', key: 'phone' },
    { title: <Translate contentKey="staff.email.label" />, dataIndex: 'email', key: 'email' },
    { title: <Translate contentKey="staff.restaurantId.label" />, dataIndex: ['restaurant', 'id'], key: 'restaurant' },
  ];

  const [expendedRow, setExpendedRow] = useState();

  const [isShowDialog, setIsShowDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IStaff[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [allowSale, setAllowSale] = useState<boolean>();

  const [isShowForm, setIsShowForm] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<IStaff>();

  const staffList = useAppSelector(state => state.staff.entities);
  const pageable = useAppSelector(state => state.staff.pageable);
  const updateSuccess = useAppSelector(state => state.staff.updateSuccess);

  const restaurantList = useAppSelector(state => state.restaurant.entities);
  const count = useAppSelector(state => state.staff.totalItems);
  const loading = useAppSelector(state => state.staff.loading);

  useEffect(() => {
    dispatch(getEntities());
  }, [pageable]);

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

  const handleOnchageStatusFilter = e => {
    dispatch(setPageable({ ...pageable, page: 0, isActive: e.target.value }));
  };

  const handleOpen = (staff: IStaff) => {
    setUpdatingItem(staff);
    setIsShowForm(true);
  };

  const handleClose = () => {
    setUpdatingItem(undefined);
    setIsShowForm(false);
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

  const handleDelete = () => {
    const nextSelectedItems = selectedRowKeys.map(key => {
      const s: IStaff = { id: key + '' };
      return s;
    });
    setSelectedItems(nextSelectedItems);
    setIsShowDialog(true);
  };

  const handleResetSelectedRowKey = e => {
    e.preventDefault();
    setSelectedRowKeys([]);
  };

  return (
    <>
      <div className="flex h-full p-2">
        <div className="flex flex-col w-1/5 gap-4 p-4">
          <Card bordered={false}>
            <Typography.Title level={5}>
              <Translate contentKey="entity.action.find" />
            </Typography.Title>
            <Input placeholder={translate('menuItem.search.placeholder')} onPressEnter={handleOnchangeSearch} />
          </Card>
          <Card bordered={false}>
            <Typography.Title level={5}>
              <Translate contentKey="entity.label.status" />
            </Typography.Title>
            <Radio.Group className="flex flex-col gap-2" defaultValue={true} onChange={handleOnchageStatusFilter}>
              <Radio className="!font-normal" value={true}>
                <Translate contentKey="menuItem.status.trueValue" />
              </Radio>
              <Radio className="!font-normal" value={false}>
                <Translate contentKey="menuItem.status.falseValue" />
              </Radio>
              <Radio className="!font-normal" value={undefined}>
                <Translate contentKey="entity.label.all" />
              </Radio>
            </Radio.Group>
          </Card>
        </div>
        <div className="w-4/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Typography.Title level={3} className="!mb-0">
                <Translate contentKey="staff.title" />
              </Typography.Title>
              {selectedRowKeys.length > 0 && (
                <Tag className="px-4 py-1" closable color="blue" onClose={handleResetSelectedRowKey}>
                  <Translate contentKey="entity.action.select" interpolate={{ number: selectedRowKeys.length }} />
                </Tag>
              )}
            </div>
          </div>

          <Table
            columns={columns.map(c => ({ ...c, ellipsis: true }))}
            dataSource={isShowForm ? [] : staffList} // Add condition to show empty array when isShowForm is true
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
              // expandedRowRender: record => <Staff staff={record} onUpdate={() => handleOpen(record)} />,
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
        </div>
      </div>
    </>
  );
};