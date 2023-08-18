import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { translate, Translate } from 'react-jhipster';
import { getEntities, setPageable } from 'app/pages/admin/restaurant/admin-restaurnat.reducer';
import { Empty, Table } from 'antd';
import { DEFAULT_PAGINATION_CONFIG } from 'app/shared/util/pagination.constants';
import { IRestaurant } from 'app/shared/model/restaurant.model';

export const AdminRestaurant = () => {
  const dispatch = useAppDispatch();

  const columns = [
    { title: <Translate contentKey="adminRestaurant.restaurant.label" />, dataIndex: 'restaurant', key: 'restaurant' },
    { title: <Translate contentKey="adminRestaurant.currencyUnit.label" />, dataIndex: 'currencyUnit', key: 'currencyUnit' },
    { title: <Translate contentKey="adminRestaurant.phone.label" />, dataIndex: 'phone', key: 'phone' },
    { title: <Translate contentKey="adminRestaurant.planExpiry.label" />, dataIndex: 'planExpiry', key: 'planExpiry' },
    { title: <Translate contentKey="adminRestaurant.langKey.label" />, dataIndex: 'langKey', key: 'langKey' },
  ];

  const [expendedRow, setExpendedRow] = useState();

  const [isShowDialog, setIsShowDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IRestaurant[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const restaurantList = useAppSelector(state => state.restaurant.entities);
  const pageable = useAppSelector(state => state.restaurant.pageable);
  const count = useAppSelector(state => state.restaurant.totalItems);
  const loading = useAppSelector(state => state.restaurant.loading);
  const updateSuccess = useAppSelector(state => state.restaurant.updateSuccess);

  useEffect(() => {
    dispatch(getEntities());
  }, [pageable]);

  useEffect(() => {
    if (selectedItems.length > 0 && updateSuccess) {
      setSelectedRowKeys([]);
      setSelectedItems([]);
    }
  }, [updateSuccess]);

  const handleOnchangeStatusFilter = e => {
    dispatch(setPageable({ ...pageable, page: 0 }));
  };

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

  return (
    <>
      <div className="flex h-full p-2">
        <Table
          columns={columns.map(s => ({ ...s, ellipsis: true }))}
          dataSource={restaurantList}
          pagination={{
            ...DEFAULT_PAGINATION_CONFIG,
            onChange: handleOnchangePage,
            total: count,
            current: pageable?.page + 1,
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
            // expandedRowRender: record => <StaffDetail staff={record} onUpdate={() => handleOpen(record)} />,
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
    </>
  );
};
