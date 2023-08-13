import { Table, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { CurrencyFormat } from 'app/shared/util/currency-utils';
import { DEFAULT_PAGINATION_CONFIG } from 'app/shared/util/pagination.constants';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { translate } from 'react-jhipster';
import { billActions, getEntities } from '../bill.reducer';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

export const BillList = () => {
  const columns = [
    { title: 'Bill code', dataIndex: 'code', key: 'code' },
    { title: 'Time', dataIndex: 'payDate', key: 'time', render: t => dayjs(t).format('L LT') },
    {
      title: 'Subtotal',
      dataIndex: 'sumMoney',
      key: 'subtotal',
      align: 'right' as const,
      render: p => <CurrencyFormat>{p}</CurrencyFormat>,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      align: 'right' as const,
      render: p => <CurrencyFormat>{p}</CurrencyFormat>,
    },
    {
      title: 'Total',
      dataIndex: 'sumMoney',
      key: 'total',
      align: 'right' as const,
      render: (subtotal, bill) => <CurrencyFormat>{subtotal - bill.discount}</CurrencyFormat>,
    },
  ];

  const dispatch = useAppDispatch();
  const loading = useAppSelector(state => state.bill.loading);
  const count = useAppSelector(state => state.bill.totalItems);
  const pageable = useAppSelector(state => state.bill.pageable);
  const billList = useAppSelector(state => state.bill.billList);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    dispatch(getEntities());
  }, []);

  const handleOnchangePage = (page, pageSize) => {
    dispatch(billActions.setPageable({ ...pageable, page: page - 1, size: pageSize }));
  };

  const onSelectRow = ({ id }, selected) => {
    if (selected) {
      setSelectedRowKeys([id]);
      dispatch(billActions.selectBillById(id));
    }
  };

  return (
    <div className="h-screen pl-6 mr-4 bg-white rounded-lg grow">
      <Scrollbars autoHide>
        <div className="flex items-center justify-between mb-4 mr-6">
          <div className="flex items-center gap-4 mt-4">
            <Typography.Title level={3} className="!mb-0">
              Bills
            </Typography.Title>
          </div>
        </div>
        <div className="flex justify-end gap-8 p-4 px-8 mb-4 mr-6 border border-solid rounded-lg border-slate-200">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-green-600">Revenue today</span>
            <span className="">3000000</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-blue-600">Bill amount today</span>
            <CurrencyFormat>30000000</CurrencyFormat>
          </div>
        </div>
        <Table
          className="mr-6"
          columns={columns.map(c => ({ ...c, ellipsis: true }))}
          dataSource={billList}
          pagination={{
            ...DEFAULT_PAGINATION_CONFIG,
            onChange: handleOnchangePage,
            total: count,
            current: pageable.page + 1,
            locale: { items_per_page: '/ ' + translate('global.table.pageText') },
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onSelect: onSelectRow,
          }}
          rowKey={'id'}
          rowClassName={'cursor-pointer'}
          loading={loading}
          onRow={(record, index) => ({ onClick: () => onSelectRow(record, !selectedRowKeys.includes(record.id)) })}
        ></Table>
      </Scrollbars>
    </div>
  );
};

export default BillList;
