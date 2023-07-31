import { ClockCircleFilled, DeleteFilled, FileOutlined, HistoryOutlined, MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import { Button, Drawer, Image, Spin, Typography } from 'antd';
import { currencyFormatter } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IItemAdditionNotification } from 'app/shared/model/order/item-addition-notfication.model';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import { IOrder } from 'app/shared/model/order/order.model';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { MdMonetizationOn, MdOutlineFastfood, MdOutlineRamenDining, MdRoomService, MdTableRestaurant } from 'react-icons/md';
import { Translate, translate } from 'react-jhipster';
import { orderActions } from '../order.reducer';
import { AddNoteForm } from './detail-note-modal';

export const OrderDetails = () => {
  const dispatch = useAppDispatch();

  const currentTab = useAppSelector(state => state.order.currentTab);
  const loading = useAppSelector(state => state.order.loading);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const isDisableNotifyButton = currentOrder.orderDetailList.every((detail: IOrderDetail) => detail.unnotifiedQuantity === 0);

  const [isOpenNoteForm, setIsOpenNoteForm] = useState(false);
  const [isOpenNotificationHistory, setIsOpenNotificationHistory] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleAddNote = detail => {
    setSelectedDetail(detail);
    setIsOpenNoteForm(true);
  };

  const handelAdjustQuantity = action => {
    dispatch(orderActions.adjustDetailQuantity(action));
  };

  const handleDuplicateItem = action => {
    dispatch(orderActions.addOrderDetail(action));
  };

  const handleDeleteItem = (detail: IOrderDetail) => {
    if (detail.quantity === detail.unnotifiedQuantity) dispatch(orderActions.deleteOrderDetail(detail.id));
  };

  return (
    <>
      {currentOrder.id && (
        <Drawer
          width={480}
          title={'History'}
          closable={true}
          open={isOpenNotificationHistory}
          onClose={() => setIsOpenNotificationHistory(false)}
        >
          {currentOrder.kitchenNotificationHistoryList.map(history => (
            <div key={history.id} className="pb-6 mb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2 font-semibold">
                  <ClockCircleFilled rev={''} className="text-blue-600" />
                  {dayjs(history.notifiedTime).format('HH:mm:ss')}
                </div>
                <div className="">
                  {`${'Bởi'} `}
                  <span className="text-blue-600">{history.createdBy}</span>
                </div>
              </div>
              {history.itemAdditionNotificationList.map((addition: IItemAdditionNotification) => (
                <div key={addition.id} className="flex gap-2 p-0.5 pl-2 text-gray-500">
                  {`+ ${addition.quantity} ${addition.menuItemName}`}
                  {addition.isPriority && <StarFilled rev={''} />}
                </div>
              ))}
            </div>
          ))}
        </Drawer>
      )}
      <AddNoteForm isOpen={isOpenNoteForm} detail={selectedDetail} handleClose={() => setIsOpenNoteForm(false)} />
      <div className="flex flex-col p-2 h-screen w-[480px] bg-white">
        <div className="px-4 pt-2 pb-4">
          <div className="flex items-center justify-between h-10">
            <Typography.Title level={4} className="!mb-1">
              {currentOrder.id ? '#' + currentOrder.code : 'Current order'}
            </Typography.Title>
            {currentOrder.id && (
              <div className="flex">
                <Button
                  size="large"
                  type="text"
                  icon={<HistoryOutlined rev="" />}
                  onClick={() => setIsOpenNotificationHistory(true)}
                ></Button>
                <Button size="large" danger type="text" icon={<DeleteFilled rev="" />}></Button>
              </div>
            )}
          </div>
          <div className="flex">
            <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg cursor-pointer">
              <MdTableRestaurant size={20} />
              <div className="">{`${currentOrder.tableList.map(table => table.name)[0]}${
                currentOrder.tableList.length > 1 ? ` + ${currentOrder.tableList.length - 1}` : ''
              }`}</div>
            </div>
          </div>
        </div>
        <div className="ml-2 mr-2 border-0 border-t border-solid border-slate-200"></div>
        <div className="pl-3 pr-2 grow order-details">
          {currentOrder.id ? (
            <Spin tip={'Loading...'} spinning={loading} className="h-full grow">
              <Scrollbars className="w-full grow">
                <div className="flex flex-col-reverse gap-2 pt-2 pr-4">
                  {currentOrder.orderDetailList.map((item, index) => (
                    <OrderDetailCard
                      key={item.id}
                      detail={item}
                      index={index + 1}
                      onAddNote={() => handleAddNote(item)}
                      handelAdjustQuantity={handelAdjustQuantity}
                      handleDuplicateItem={handleDuplicateItem}
                      handleDeleteItem={handleDeleteItem}
                    />
                  ))}
                </div>
              </Scrollbars>
            </Spin>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="flex items-center justify-center w-40 text-blue-600 bg-blue-100 rounded-full aspect-square">
                <MdOutlineRamenDining size={60} />
              </div>
              <Typography.Title level={4} className="mt-3 !mb-0">
                Chưa gọi món
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
                {currencyFormatter(
                  currentOrder.orderDetailList.map(detail => detail.quantity * detail.menuItem.sellPrice).reduce((a, b) => a + b, 0)
                )}
              </Typography.Title>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Typography.Text className="!m-0 !text-gray-400">
                <Translate contentKey="order.orderDetails.ordered.total" />
              </Typography.Text>
              <Typography.Title level={5} className="font-semibold !m-0">
                {currencyFormatter(
                  currentOrder.orderDetailList.map(detail => detail.quantity * detail.menuItem.sellPrice).reduce((a, b) => a + b, 0)
                )}
              </Typography.Title>
            </div>
          )}
        </div>
        <div className="flex flex-col p-4 pb-0 ml-2 mr-4">
          <div className="flex items-center justify-between">
            <Typography.Text>
              <Translate contentKey="order.orderDetails.total" />
            </Typography.Text>
            <Typography.Title level={4} className="font-semibold !mt-0">
              {currencyFormatter(
                currentOrder.orderDetailList.map(detail => detail.quantity * detail.menuItem.sellPrice).reduce((a, b) => a + b, 0)
              )}
            </Typography.Title>
          </div>
        </div>
        <div className="flex gap-2 p-2 pr-4 mb-2">
          <Button
            icon={<MdMonetizationOn size={20} />}
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
            onClick={() => dispatch(orderActions.notifyKitchen(currentOrder.id))}
            disabled={isDisableNotifyButton}
          >
            <Translate contentKey="order.orderDetails.notify" />
          </Button>
        </div>
      </div>
    </>
  );
};

const OrderDetailCard = ({
  detail,
  index,
  onAddNote,
  handelAdjustQuantity,
  handleDuplicateItem,
  handleDeleteItem,
}: {
  detail: IOrderDetail;
  index: number;
  onAddNote?: any;
  handelAdjustQuantity: any;
  handleDuplicateItem: any;
  handleDeleteItem: any;
}) => {
  return (
    <motion.div
      key={detail.id}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
              disabled={detail.quantity < 1}
              onClick={() => handelAdjustQuantity({ orderDetailId: detail.id, quantityAdjust: -1 })}
              type="primary"
              size="small"
              className="!p-0 !w-5 !h-5 aspect-square shadow-none flex justify-center items-center"
              icon={<MinusOutlined rev={''} />}
            />
            <Typography.Text className={`min-w-[36px] text-center ${detail.unnotifiedQuantity > 0 ? 'text-blue-600 font-semibold' : ''}`}>
              {detail.quantity}
            </Typography.Text>
            <Button
              onClick={() => handelAdjustQuantity({ orderDetailId: detail.id, quantityAdjust: 1 })}
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
          onClick={() => handleDeleteItem(detail)}
          danger
          className="!h-8 !w-8 rounded-lg shadow-none border-none aspect-square bg-red-100 !text-red-600 "
          icon={<DeleteFilled rev={''} />}
        />
        <Button
          onClick={() => handleDuplicateItem({ menuItem: { id: detail.menuItem.id }, quantity: 1 }, detail.orderId)}
          className="!h-8 !w-8 rounded-lg shadow-none border-none aspect-square bg-blue-100 !text-blue-600"
          icon={<PlusOutlined rev={''} />}
        />
      </div>
    </motion.div>
  );
};
