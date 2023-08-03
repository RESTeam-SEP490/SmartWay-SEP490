import { ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Radio, Segmented, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getZoneEntities } from 'app/pages/tenant/management/zone/zone.reducer';
import TableIcon from 'app/shared/icons/table-icon';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import { IOrder } from 'app/shared/model/order/order.model';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Translate } from 'react-jhipster';
import { orderActions } from '../order.reducer';
import { MdFastfood } from 'react-icons/md';

export const TableList = () => {
  const dispatch = useAppDispatch();
  const tableList = useAppSelector(state => state.diningTable.entities);
  const zoneList = useAppSelector(state => state.zone.entities);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const orders: IOrder[] = useAppSelector(state => state.order.activeOrders);

  const [filteredTableList, setFilteredTableList] = useState([]);
  const [filter, setFilter] = useState({ zoneId: '', isFree: undefined });

  useEffect(() => {
    dispatch(getZoneEntities({}));
  }, []);

  useEffect(() => {
    if (tableList?.length > 0 && currentOrder.id === null) dispatch(orderActions.selectOrderByTable(tableList[0]));
  }, [tableList, orders]);

  useEffect(() => {
    const { zoneId, isFree } = filter;
    let nextFilteredTableList: IDiningTable[] = [...tableList];
    if (zoneId?.length > 0) nextFilteredTableList = nextFilteredTableList.filter(table => table.zone?.id === zoneId);
    if (isFree !== undefined) nextFilteredTableList = nextFilteredTableList.filter(table => table.isFree === isFree);
    setFilteredTableList(nextFilteredTableList);
  }, [filter, tableList]);

  const handleSelectTable = table => {
    dispatch(orderActions.selectOrderByTable(table));
  };

  return (
    <div className="p-2 bg-white h-[calc(100vh-66px)] flex flex-col rounded-se-lg rounded-b-lg">
      <div className="flex flex-col gap-4 px-2 py-4">
        <div className="flex items-center justify-between">
          <Segmented
            options={[
              { label: <Translate contentKey="entity.label.all" />, value: '' },
              ...zoneList.map(z => ({ label: z.name, value: z.id })),
            ]}
            onChange={value => setFilter(prev => ({ ...prev, zoneId: value.toString() }))}
          />
          <Button
            size="large"
            icon={<SyncOutlined rev="" />}
            shape="circle"
            type="ghost"
            className="hover:!text-blue-600 !text-slate-600"
          ></Button>
        </div>
        <Radio.Group
          className="flex items-center gap-2 px-2"
          defaultValue={undefined}
          onChange={e => setFilter(prev => ({ ...prev, isFree: e.target.value }))}
        >
          <Radio className="!font-normal" value={undefined}>
            <Translate contentKey="entity.label.all" />
          </Radio>
          <Radio className="!font-normal" value={true}>
            <Translate contentKey="order.tableList.status.available" />
          </Radio>
          <Radio className="!font-normal" value={false}>
            <Translate contentKey="order.tableList.status.occupied" />
          </Radio>
        </Radio.Group>
      </div>
      <Scrollbars className="bg-gray-200 rounded-md grow">
        <div className="flex flex-wrap gap-4 m-4 ">
          {filteredTableList.map(table => (
            <TableCard
              key={table.id}
              table={table}
              handleSelectTable={() => handleSelectTable(table)}
              isSelected={currentOrder.tableList.map(t => t.id).includes(table.id)}
            />
          ))}
        </div>
      </Scrollbars>
    </div>
  );
};

const TableCard = ({ table, handleSelectTable, isSelected }: { table: IDiningTable; handleSelectTable: any; isSelected: boolean }) => {
  const orders: IOrder[] = useAppSelector(state => state.order.activeOrders);

  const orderOfThisTable: IOrder = orders?.find(o => o.tableList.map(t => t.id).includes(table.id));

  const hasReadyToServeItem = orderOfThisTable?.orderDetailList.some(detail => detail.hasReadyToServeItem);

  return (
    <div
      onClick={handleSelectTable}
      className={`relative flex flex-col items-center shadow-sm bg-white w-32 h-40 p-2 rounded-lg cursor-pointer hover:shadow-md border-2 border-solid ${
        isSelected ? 'border-blue-700 !bg-blue-100' : 'border-transparent'
      }`}
    >
      <Typography.Text className={`pb-4 font-semibold ${isSelected ? '!text-blue-700' : ''}`}>{table.name}</Typography.Text>
      <TableIcon size={80} status={isSelected ? 'selected' : table.isFree ? 'available' : 'occupied'} numberOfSeats={table.numberOfSeats} />
      {orderOfThisTable ? (
        <div className={`flex gap-2 mt-4 px-3 py-1 rounded-full ${isSelected ? 'bg-white text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
          <ClockCircleOutlined rev="" />
          {dayjs(orderOfThisTable.createdDate).format('HH:mm')}
        </div>
      ) : (
        ''
      )}
      {hasReadyToServeItem && (
        <span className="absolute flex w-6 h-6 -top-2 -right-2">
          <span className="absolute inline-flex w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></span>
          <span className="relative inline-flex items-center justify-center w-6 h-6 text-white bg-green-600 rounded-full">
            <MdFastfood size={14} />
          </span>
        </span>
      )}
    </div>
  );
};

export default TableList;
