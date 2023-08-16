import { BlockOutlined } from '@ant-design/icons';
import { Radio, Segmented, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getZoneEntities } from 'app/pages/tenant/management/zone/zone.reducer';
import TableIcon from 'app/shared/icons/table-icon';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import { IOrder } from 'app/shared/model/order/order.model';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { GiWoodenChair } from 'react-icons/gi';
import { MdFastfood } from 'react-icons/md';
import { Translate } from 'react-jhipster';
import { orderActions } from '../order.reducer';

export const TableList = () => {
  const dispatch = useAppDispatch();
  const tableList = useAppSelector(state => state.diningTable.entities);
  const zoneList = useAppSelector(state => state.zone.entities);
  const orderLoading = useAppSelector(state => state.order.loading);
  const tableLoading = useAppSelector(state => state.diningTable.loading);
  const orders: IOrder[] = useAppSelector(state => state.order.activeOrders);

  const [filteredTableList, setFilteredTableList] = useState([]);
  const [filter, setFilter] = useState({ zoneId: '', isFree: undefined });

  useEffect(() => {
    dispatch(getZoneEntities({}));
  }, []);

  useEffect(() => {
    if (tableList?.length > 0 && !tableLoading && !orderLoading) dispatch(orderActions.selectOrderByTable(tableList[0]));
  }, [tableLoading, orderLoading]);

  useEffect(() => {
    const { zoneId, isFree } = filter;
    let nextFilteredTableList: IDiningTable[] = [...tableList];
    if (zoneId?.length > 0) nextFilteredTableList = nextFilteredTableList.filter(table => table.zone?.id === zoneId);
    if (isFree !== undefined) {
      if (isFree === null)
        nextFilteredTableList = nextFilteredTableList.filter(table => {
          const orderOfThisTable: IOrder = orders?.filter(o => !o.takeAway).find(o => o.tableList.some(t => t.id === table.id));
          return orderOfThisTable?.paid;
        });
      else nextFilteredTableList = nextFilteredTableList.filter(table => table.isFree === isFree);
    }
    setFilteredTableList(nextFilteredTableList);
  }, [filter, tableList]);

  const handleSelectTable = table => {
    dispatch(orderActions.selectOrderByTable(table));
  };

  return (
    <div className="p-2 bg-white h-[calc(100vh-66px)] flex flex-col rounded-se-lg rounded-b-lg">
      <div className="flex flex-col gap-2 px-2 py-4">
        <Scrollbars autoHide className="!h-[52px]">
          <Segmented
            className="mb-1"
            options={[
              { label: <Translate contentKey="entity.label.all" />, value: '' },
              ...zoneList.map(z => ({ label: z.name, value: z.id })),
            ]}
            onChange={value => setFilter(prev => ({ ...prev, zoneId: value.toString() }))}
          />
        </Scrollbars>
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
          <Radio className="!font-normal" value={null}>
            Paid
            {/* <Translate contentKey="order.tableList.status.occupied" /> */}
          </Radio>
        </Radio.Group>
      </div>
      <Scrollbars className="bg-gray-200 rounded-md grow">
        <div className="flex flex-wrap gap-4 m-4 content-stretch">
          {filteredTableList?.map(table => (
            <TableCard key={table.id} table={table} handleSelectTable={() => handleSelectTable(table)} />
          ))}
        </div>
      </Scrollbars>
    </div>
  );
};

const TableCard = ({ table, handleSelectTable }: { table: IDiningTable; handleSelectTable: any }) => {
  const orders: IOrder[] = useAppSelector(state => state.order.activeOrders);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);

  const orderOfThisTable: IOrder = orders?.filter(o => !o.takeAway).find(o => o.tableList.some(t => t.id === table.id));
  const isSelected = !currentOrder.takeAway && currentOrder.tableList.some(t => t.id === table.id);
  const hasReadyToServeItem = orderOfThisTable?.orderDetailList.some(detail => detail.readyToServeQuantity > 0);

  const status = !orderOfThisTable ? 'available' : orderOfThisTable.paid ? 'billed' : 'occupied';

  return (
    <div
      onClick={handleSelectTable}
      className={`relative flex flex-col items-center shadow-sm bg-white w-36 h-48 p-2 rounded-lg cursor-pointer hover:shadow-md border-4 border-solid border-transparent
      ${isSelected && status === 'available' ? '!border-blue-400 !bg-blue-50' : ''} 
      ${isSelected && status === 'billed' ? '!border-green-400 !bg-green-50' : ''} 
      ${isSelected && status === 'occupied' ? '!border-gray-400 !bg-gray-50' : ''}
      `}
    >
      <Typography.Text
        className={`flex items-center gap-2 pb-4 !mt-2 font-semibold
       ${status === 'available' ? '!text-blue-700' : ''} 
       ${status === 'billed' ? '!text-green-700' : ''} 
       ${status === 'occupied' ? '!text-gray-700' : ''} 
       `}
      >
        {table.name}
      </Typography.Text>
      <TableIcon size={100} status={status} order={orderOfThisTable} />
      <Typography.Text
        className={`flex mt-6 items-center 
             ${status === 'available' ? '!text-blue-700' : ''} 
             ${status === 'billed' ? '!text-green-700' : ''} 
             ${status === 'occupied' ? '!text-gray-700' : ''} `}
      >
        <GiWoodenChair size={24} />
        {': ' + (table.numberOfSeats ?? '--')}
      </Typography.Text>

      {hasReadyToServeItem && (
        <span className="absolute flex w-6 h-6 -top-2 -right-2">
          <span className="absolute inline-flex w-full h-full bg-yellow-500 rounded-full opacity-75 animate-ping"></span>
          <span className="relative inline-flex items-center justify-center w-6 h-6 text-white bg-yellow-600 rounded-full">
            <MdFastfood size={14} />
          </span>
        </span>
      )}
      {orderOfThisTable?.tableList.length > 1 && isSelected && (
        <>
          <div className="absolute h-2 translate-x-1/2 bg-blue-100 -top-1 right-1/2 w-9"></div>
          <div
            className={`absolute top-0 flex items-center justify-center p-1 text-blue-100 translate-x-1/2 -translate-y-1/2 rounded-full aspect-square right-1/2 table-badge  ${
              status === 'billed' ? '!bg-green-700' : ''
            } 
       ${status === 'occupied' ? '!bg-gray-700' : ''} `}
          >
            <BlockOutlined rev="" className="text-lg" />
          </div>
        </>
      )}
    </div>
  );
};

export default TableList;
