import { ClockCircleOutlined, PlusCircleFilled, ShoppingFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IOrder } from 'app/shared/model/order/order.model';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { orderActions } from '../order.reducer';
import { MdFastfood, MdShoppingBag } from 'react-icons/md';
import Search from 'antd/es/input/Search';

export const TakeAwayOrderList = () => {
  const dispatch = useAppDispatch();
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const orders: IOrder[] = useAppSelector(state => state.order.activeOrders);

  const [filteredOrder, setFilteredOrder] = useState([]);
  const [filter, setFilter] = useState({ searchText: '' });

  useEffect(() => {
    const nextFilteredOrder = [...orders].filter(o => o.takeAway && o.code.includes(filter.searchText));
    setFilteredOrder(nextFilteredOrder);
  }, [filter, orders]);

  const handleCreateOrder = () => {
    dispatch(orderActions.createOrder({ menuItemId: '07858e0d-1d75-4242-ac4b-8cff8e0b66e8', tableIdList: [] }));
  };

  return (
    <div className="p-2 bg-white h-[calc(100vh-66px)] flex flex-col rounded-se-lg rounded-b-lg">
      <div className="flex flex-col gap-2 px-2 py-4">
        <Search className="w-64 pb-1 mt-1 mb-3" enterButton onChange={e => setFilter(prev => ({ ...prev, searchText: e.target.value }))} />
      </div>
      <Scrollbars className="bg-gray-200 rounded-md grow">
        <div className="flex flex-wrap gap-4 m-4 content-stretch">
          <div
            onClick={handleCreateOrder}
            className={`relative flex flex-col justify-center text-blue-600 items-center shadow-sm w-36 h-48 p-2 rounded-lg cursor-pointer hover:shadow-md border-2 border-dashed border-blue-600`}
          >
            <PlusCircleFilled rev={''} className="text-4xl" />
            <div className="mt-4 font-semibold text-center">New order</div>
          </div>
          {filteredOrder
            .sort((a: IOrder, b: IOrder) => (dayjs(a.createdDate).isAfter(dayjs(b.createdDate)) ? -1 : 1))
            .map(order => (
              <OrderCard key={order.id} order={order} handleSelectTable={() => dispatch(orderActions.selectOrderById(order.id))} />
            ))}
        </div>
      </Scrollbars>
    </div>
  );
};

const OrderCard = ({ order, handleSelectTable }: { order: IOrder; handleSelectTable?: any }) => {
  const hasReadyToServeItem = order?.orderDetailList.some(detail => detail.readyToServeQuantity > 0);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const isSelected = currentOrder.id === order.id;

  return (
    <div
      onClick={handleSelectTable}
      className={`relative flex flex-col items-center shadow-sm bg-white w-36 h-48 p-2 rounded-lg cursor-pointer hover:shadow-md border-2 border-solid ${
        isSelected ? 'border-blue-700 !bg-blue-100' : 'border-transparent'
      }`}
    >
      <Typography.Text className={`pb-3 !mt-2 font-semibold ${isSelected ? '!text-blue-700' : ''}`}>{'#' + order.code}</Typography.Text>
      <MdShoppingBag className={`text-4xl ${isSelected ? 'text-blue-700' : 'text-gray-400'}`} size={80} />
      {order ? (
        <div className={`flex gap-2 mt-2 px-3 py-1 rounded-full ${isSelected ? 'bg-white text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
          <ClockCircleOutlined rev="" />
          {dayjs(order.createdDate).format('HH:mm')}
        </div>
      ) : (
        ''
      )}
      {order.orderDetailList.filter(detail => detail.quantity > 0).length > 0 &&
        order.orderDetailList.every(o => o.servedQuantity === o.quantity) && (
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

export default TakeAwayOrderList;
