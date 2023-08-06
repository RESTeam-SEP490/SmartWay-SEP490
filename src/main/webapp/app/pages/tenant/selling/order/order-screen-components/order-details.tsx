import {
  BlockOutlined,
  ClockCircleFilled,
  DeleteFilled,
  HistoryOutlined,
  MinusOutlined,
  PlusOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Button, Drawer, Image, notification, Spin, Typography } from 'antd';
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
import { Translate } from 'react-jhipster';
import { orderActions } from '../order.reducer';
import { AddNoteForm } from './modals/detail-note-modal';
import { NumbericKeyboard } from './modals/numberic-keyboard';
import { TablesOfOrderModal } from './modals/order-table-modal';

export const OrderDetails = () => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(state => state.order.loading);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const isDisableNotifyButton = currentOrder?.orderDetailList.every((detail: IOrderDetail) => detail.unnotifiedQuantity === 0);

  const [isOpenNoteForm, setIsOpenNoteForm] = useState(false);
  const [isOpenNumbericKeyboard, setIsOpenNumbericKeyboard] = useState(false);
  const [isOpenTablesOfOrderModal, setIsOpenTablesOfOrderModal] = useState(false);
  const [adjustingDetail, setAdjustingDetail] = useState<IOrderDetail>({});
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

  const handleOpenNumbericKeyboard = (item: IOrderDetail) => {
    setAdjustingDetail(item);
    setIsOpenNumbericKeyboard(true);
  };

  return (
    <>
      <NumbericKeyboard detail={adjustingDetail} isOpen={isOpenNumbericKeyboard} handleClose={() => setIsOpenNumbericKeyboard(false)} />
      <TablesOfOrderModal isOpen={isOpenTablesOfOrderModal} handleClose={() => setIsOpenTablesOfOrderModal(false)} />
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
                  {addition.priority && <StarFilled className="text-yellow-600" rev={''} />}
                </div>
              ))}
            </div>
          ))}
        </Drawer>
      )}
      <AddNoteForm isOpen={isOpenNoteForm} detail={selectedDetail} handleClose={() => setIsOpenNoteForm(false)} />
      <div className="flex flex-col p-2 h-screen w-[500px] bg-white rounded-l-lg" key={currentOrder.id}>
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
            <div
              className="relative flex items-center justify-center gap-2 px-6 py-2 text-sm font-semibold text-blue-700 bg-blue-100 border-2 border-blue-600 border-solid rounded-lg cursor-pointer table-tag-badge"
              onClick={() => setIsOpenTablesOfOrderModal(true)}
            >
              <div className="absolute left-0 z-10 flex items-center justify-center p-1 text-blue-100 -translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full aspect-square top-1/2">
                {currentOrder.tableList.length > 1 ? <BlockOutlined rev="" /> : <MdTableRestaurant size={16} />}
              </div>
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
                      openNumbericKeyboard={() => handleOpenNumbericKeyboard(item)}
                    />
                  ))}
                </div>
              </Scrollbars>
            </Spin>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: '-50%' }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, x: '50%' }}
              layout
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <div className="flex items-center justify-center w-40 text-blue-600 bg-blue-100 rounded-full aspect-square">
                <MdOutlineRamenDining size={60} />
              </div>
              <Typography.Title level={4} className="mt-3 !mb-0">
                Chưa gọi món
              </Typography.Title>
              <Typography.Text className="text-gray-500">Vui lòng chọn món trong thực đơn</Typography.Text>
            </motion.div>
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
            onClick={() => {
              notification.info({ message: 'hahaha' });
            }}
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
  openNumbericKeyboard,
}: {
  detail: IOrderDetail;
  index: number;
  onAddNote?: any;
  handelAdjustQuantity: any;
  handleDuplicateItem: any;
  handleDeleteItem: any;
  openNumbericKeyboard: any;
}) => {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      key={detail.id}
      initial={{ opacity: 0, x: '-50%' }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, x: '50%' }}
      layout
      className="relative flex items-center w-full h-24 p-2 text-blue-600 bg-white border !border-transparent border-solid rounded-lg hover:!border-blue-200 hover:shadow-md"
    >
      <div className="relative flex items-center justify-center h-full bg-blue-100 rounded-md !aspect-square">
        {detail.menuItem.imageUrl ? (
          <>
            <Image preview={false} src={detail.menuItem.imageUrl} className="w-full h-full overflow-hidden none-draggable" />
          </>
        ) : (
          <>
            <MdOutlineFastfood size={32} />
          </>
        )}
        {detail.unnotifiedQuantity > 0 && (
          <Button
            size="small"
            className={`absolute border-0 !p-0 right-1 bottom-1 ${
              detail.priority ? 'text-yellow-600' : 'text-slate-300'
            } hover:!text-yellow-500`}
            icon={<StarFilled rev={''} />}
            onClick={() => dispatch(orderActions.changePriority({ orderDetailId: detail.id, priority: !detail.priority }))}
          />
        )}
        {detail.readyToServeQuantity > 0 && (
          <span className="absolute flex w-5 h-5 -top-1 -right-1">
            <span className="absolute inline-flex w-full h-full bg-yellow-500 rounded-full opacity-75 animate-ping"></span>
            <span className="relative inline-flex items-center justify-center w-5 h-5 text-xs text-white bg-yellow-600 rounded-full">
              {detail.readyToServeQuantity}
            </span>
          </span>
        )}
        {detail.servedQuantity > 0 && (
          <div className="absolute bottom-0 left-0 flex items-center justify-center w-4 h-4 bg-green-600 rounded-es-lg detail-badge">
            <span className="mb-1 ml-1 text-xs text-white">{detail.servedQuantity}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between h-full px-4 grow">
        <div className="">
          <Typography.Text className="w-64 font-semibold text" ellipsis={{ tooltip: detail.menuItem.name }}>
            {index + '. ' + detail.menuItem.name}
          </Typography.Text>
          <div
            onClick={() => {
              if (detail.quantity === detail.unnotifiedQuantity) onAddNote();
            }}
            className={`flex items-center !p-0 py-1 !w-full !h-6 text-left !text-xs ${
              detail.note ? '!text-blue-600' : detail.quantity === detail.unnotifiedQuantity ? 'text-gray-500' : 'text-gray-300'
            } ${
              detail.quantity === detail.unnotifiedQuantity
                ? 'cursor-pointer hover:text-gray-600 hover:bg-gray-100 rounded-lg'
                : 'cursor-default'
            }`}
          >
            {detail.note ? detail.note : detail.quantity !== detail.unnotifiedQuantity ? 'Không có ghi chú' : 'Nhập ghi chú...'}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600 w-fit">
            <Button
              disabled={detail.quantity === 1}
              onClick={() => handelAdjustQuantity({ orderDetailId: detail.id, quantityAdjust: -1 })}
              type="primary"
              size="small"
              className="!p-0 !w-6 !h-6 shadow-none flex justify-center items-center"
              icon={<MinusOutlined rev={''} />}
            />
            <div className="min-w-[40px] flex gap-1.5 justify-center items-end cursor-pointer" onClick={openNumbericKeyboard}>
              <Typography.Text className={`!m-0 ${detail.unnotifiedQuantity > 0 ? '!text-blue-600 font-semibold' : ''}`}>
                {detail.quantity}
              </Typography.Text>
            </div>
            <Button
              onClick={() => handelAdjustQuantity({ orderDetailId: detail.id, quantityAdjust: 1 })}
              type="primary"
              size="small"
              className="!p-0 !w-6 !h-6 shadow-none flex justify-center items-center"
              icon={<PlusOutlined rev={''} />}
            />
          </div>
          <span className="font-semibold">{currencyFormatter(detail.menuItem.sellPrice * detail.quantity)}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <Button
          onClick={() => handleDeleteItem(detail)}
          danger
          className="!h-9 !w-9 rounded-lg shadow-none border-none aspect-square bg-red-100 !text-red-600 "
          icon={<DeleteFilled rev={''} />}
        />
        <Button
          onClick={() => handleDuplicateItem({ menuItem: { id: detail.menuItem.id }, quantity: 1 }, detail.orderId)}
          className="!h-9 !w-9 rounded-lg shadow-none border-none aspect-square bg-blue-100 !text-blue-600"
          icon={<PlusOutlined rev={''} />}
        />
      </div>
    </motion.div>
  );
};
