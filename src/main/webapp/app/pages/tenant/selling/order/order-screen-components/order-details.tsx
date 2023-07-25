import { DeleteFilled, FileOutlined, MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import { Button, Image, Spin, Tabs, Typography } from 'antd';
import { currencyFormatter } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IOrderDetail } from 'app/shared/model/order-detail.model';
import { IOrder } from 'app/shared/model/order.model';
import { motion } from 'framer-motion';
import React, { useEffect, useState, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { MdMonetizationOn, MdOutlineFastfood, MdOutlineRamenDining, MdRoomService } from 'react-icons/md';
import { selectTab } from '../order.reducer';
import { addItem, adjustItemQuantity, connectOrderWebSocket, notifyKitchen, removeItem } from '../order.websocket';
import { AddNoteForm } from './detail-note-modal';
import { Translate, translate } from 'react-jhipster';

export const OrderDetails = ({ currentOrder }: { currentOrder: IOrder }) => {
  const dispatch = useAppDispatch();

  const currentTab = useAppSelector(state => state.order.currentTab);
  const loading = useAppSelector(state => state.order.loading);
  const changedDetailId = useAppSelector(state => state.order.changedDetailId);

  const [orderingItems, setOrderingItems] = useState([]);
  const [orderedItems, setOrderedItems] = useState([]);
  const [isOpenNoteForm, setIsOpenNoteForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    const items = currentOrder.items;
    setOrderedItems(items.filter((i: IOrderDetail) => i.notifiedTime !== null));
    setOrderingItems(items.filter((i: IOrderDetail) => i.notifiedTime === null));
  }, [currentOrder]);

  const handleChangeTab = key => {
    dispatch(selectTab(key));
  };

  const handleAddNote = detail => {
    setSelectedDetail(detail);
    setIsOpenNoteForm(true);
  };

  return (
    <>
      <AddNoteForm isOpen={isOpenNoteForm} detail={selectedDetail} handleClose={() => setIsOpenNoteForm(false)} />
      <div className="flex flex-col p-2 h-screen w-[480px] bg-white">
        <div className="px-4 pt-2">
          <Typography.Title level={4} className="!mb-1">
            {currentOrder.table.name}
          </Typography.Title>
          <Typography.Title level={5} className="!mt-0 !mb-3 !text-slate-400">
            {currentOrder.id ? '#' + currentOrder.code : '--'}
          </Typography.Title>
        </div>
        <div className="ml-2 mr-2 border-0 border-t border-solid border-slate-200"></div>
        <div className="pl-3 pr-2 grow">
          {currentOrder.id ? (
            <Tabs centered className="order-details" activeKey={currentTab} defaultActiveKey="ordering-tab" onChange={handleChangeTab}>
              <Tabs.TabPane tab={translate('order.orderDetails.ordering.label')} key={'ordering-tab'}>
                <Spin tip={'Loading...'} spinning={loading} className="h-full grow">
                  <Scrollbars className="w-full grow">
                    {orderingItems.length > 0 ? (
                      <div className="flex flex-col-reverse gap-2 pt-2 pr-4">
                        {orderingItems.map((item, index) => (
                          <OrderDetailCard detail={item} index={index + 1} onAddNote={() => handleAddNote(item)} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="flex items-center justify-center w-40 text-blue-600 bg-blue-100 rounded-full aspect-square">
                          <MdOutlineRamenDining size={60} />
                        </div>
                        <Typography.Title level={4} className="mt-3 !mb-0">
                          Chưa có món đang order
                        </Typography.Title>
                        <Typography.Text className="text-gray-500">Vui lòng chọn món trong thực đơn</Typography.Text>
                      </div>
                    )}
                  </Scrollbars>
                </Spin>
              </Tabs.TabPane>
              <Tabs.TabPane tab={translate('order.orderDetails.ordered.label')} key={'ordered-tab'}>
                <Scrollbars className="w-full grow">
                  <div className="flex flex-col-reverse gap-2 pt-2 pr-4">
                    {orderedItems.map((item, index) => (
                      <OrderDetailCard detail={item} index={index + 1} />
                    ))}
                  </div>
                </Scrollbars>
              </Tabs.TabPane>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="flex items-center justify-center w-40 text-blue-600 bg-blue-100 rounded-full aspect-square">
                <MdOutlineRamenDining size={60} />
              </div>
              <Typography.Title level={4} className="mt-3 !mb-0">
                Chưa có món nào
              </Typography.Title>
              <Typography.Text className="text-gray-500">Vui lòng chọn món trong thực đơn</Typography.Text>
            </div>
          )}
        </div>
        <div className="p-2 pl-8 pr-10 -mx-2 bg-green-100 border-0 border-t border-solid border-slate-200">
          {currentTab === 'ordering-tab' ? (
            <div className="flex items-center justify-between">
              <Typography.Text className="!m-0 !text-gray-400">
                <Translate contentKey="order.orderDetails.ordering.total" />
              </Typography.Text>
              <Typography.Title level={5} className="font-semibold !m-0">
                {currencyFormatter(orderingItems.map(detail => detail.quantity * detail.menuItem.sellPrice).reduce((a, b) => a + b, 0))}
              </Typography.Title>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Typography.Text className="!m-0 !text-gray-400">
                <Translate contentKey="order.orderDetails.ordered.total" />
              </Typography.Text>
              <Typography.Title level={5} className="font-semibold !m-0">
                {currencyFormatter(orderedItems.map(detail => detail.quantity * detail.menuItem.sellPrice).reduce((a, b) => a + b, 0))}
              </Typography.Title>
            </div>
          )}
        </div>
        <div className="flex flex-col p-4 pb-0 ml-2 mr-4">
          <div className="flex items-center justify-between">
            <Typography.Text>Total</Typography.Text>
            <Typography.Title level={4} className="font-semibold !mt-0">
              {currencyFormatter(currentOrder.items.map(detail => detail.quantity * detail.menuItem.sellPrice).reduce((a, b) => a + b, 0))}
            </Typography.Title>
          </div>
        </div>
        <div className="flex gap-2 p-2 pr-4 mb-2">
          <Button
            icon={<MdMonetizationOn size={20} />}
            onClick={() => connectOrderWebSocket()}
            size="large"
            type="primary"
            className="grow flex items-center justify-center bg-green-600 hover:!bg-green-500 active:!bg-green-700"
          >
            <Translate contentKey="order.orderDetails.charge" />
          </Button>
          <Button
            size="large"
            type="primary"
            className="flex items-center justify-center grow "
            icon={<MdRoomService size={20} />}
            onClick={() => notifyKitchen(currentOrder.id)}
          >
            <Translate contentKey="order.orderDetails.notify" />
          </Button>
        </div>
      </div>
    </>
  );
};

const OrderDetailCard = ({ detail, index, onAddNote }: { detail: IOrderDetail; index: number; onAddNote?: any }) => {
  return (
    <motion.div
      key={detail.id}
      transition={{ duration: 0.5, cu: 'easeIn' }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center w-full h-24 p-2 text-blue-600 bg-white border !border-transparent border-solid rounded-lg hover:!border-blue-200 hover:shadow-md"
    >
      <div className="relative flex items-center justify-center h-full overflow-hidden bg-blue-100 rounded-md aspect-square">
        {detail.menuItem.imageUrl ? (
          <>
            <Image preview={false} src={detail.menuItem.imageUrl} className="w-full h-full overflow-hidden none-draggable" />
          </>
        ) : (
          <>
            <MdOutlineFastfood size={32} />
          </>
        )}
        <Button
          size="small"
          className="absolute border-0 !p-0 right-1 top-1 text-slate-300 hover:!text-yellow-600"
          icon={<StarFilled rev={''} />}
        />
      </div>
      <div className="flex flex-col justify-between h-full px-4 grow">
        <Typography.Text className="w-full font-semibold text" ellipsis={{ tooltip: detail.menuItem.name }}>
          {index + '. ' + detail.menuItem.name}
        </Typography.Text>
        <Button
          onClick={onAddNote}
          type="text"
          className="!p-0 py-1 !w-full !h-6 text-left !text-xs hover:!bg-transparent text-gray-400"
          icon={<FileOutlined rev={''} />}
        >
          {detail.note ? detail.note : 'Nhập ghi chú...'}
        </Button>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600 w-fit">
            <Button
              disabled={detail.quantity === 1}
              onClick={() => adjustItemQuantity({ orderDetailId: detail.id, quantityAdjust: -1 }, detail.orderId)}
              type="primary"
              size="small"
              className="!p-0 !w-5 !h-5 aspect-square shadow-none flex justify-center items-center"
              icon={<MinusOutlined rev={''} />}
            />
            <Typography.Text className="min-w-[36px] text-center">{detail.quantity}</Typography.Text>
            <Button
              onClick={() => adjustItemQuantity({ orderDetailId: detail.id, quantityAdjust: 1 }, detail.orderId)}
              type="primary"
              size="small"
              className="!p-0 !w-5 !h-5 aspect-square shadow-none flex justify-center items-center"
              icon={<PlusOutlined rev={''} />}
            />
          </div>
          <span className="font-semibold">{currencyFormatter(detail.menuItem.sellPrice * detail.quantity)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button
          onClick={() => removeItem(detail.id, detail.orderId)}
          danger
          className="!h-8 !w-8 rounded-lg shadow-none border-none aspect-square bg-red-100 !text-red-600 "
          icon={<DeleteFilled rev={''} />}
        />
        <Button
          onClick={() => addItem({ menuItem: { id: detail.menuItem.id }, orderId: detail.orderId, quantity: 1 }, detail.orderId)}
          className="!h-8 !w-8 rounded-lg shadow-none border-none aspect-square bg-blue-100 !text-blue-600"
          icon={<PlusOutlined rev={''} />}
        />
      </div>
    </motion.div>
  );
};
