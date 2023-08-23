import React from 'react';
import { AuthenticatedAccountMenu, LocaleMenu } from 'app/shared/layout/menus';
import { Button, Image, Spin, Typography } from 'antd';
import { useAppSelector } from 'app/config/store';
import { IBill } from 'app/shared/model/bill.model';
import { BlockOutlined, DeleteFilled, MinusOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import { MdOutlineFastfood, MdOutlineRamenDining, MdPerson, MdShoppingBag, MdTableRestaurant } from 'react-icons/md';
import { alphabetCompare } from 'app/app.constant';
import Scrollbars from 'react-custom-scrollbars-2';
import { motion } from 'framer-motion';
import { Translate, translate } from 'react-jhipster';
import { CurrencyFormat } from 'app/shared/util/currency-utils';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';

export const BillDetails = () => {
  const curerntBill: IBill = useAppSelector(state => state.bill.currentBill);

  return (
    <div className="flex w-[500px]">
      <div className="flex flex-col h-full">
        <div className="flex items-center !text-white justify-end h-12 gap-4 mr-8">
          <LocaleMenu />
          <AuthenticatedAccountMenu />
        </div>
        <div className="flex flex-col p-2 grow w-[500px] bg-white rounded-l-lg" key={curerntBill.id}>
          <div className="px-4 pt-2 pb-4 ">
            <div className="flex items-center justify-between h-10">
              <Typography.Title level={4} className="!mb-1">
                {curerntBill.id ? '#' + curerntBill.code : translate('order.current.label')}
              </Typography.Title>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={`relative flex items-center justify-center gap-2 py-1 pl-6 pr-4 text-sm font-semibold text-blue-700 duration-1000 bg-blue-100 border-2 border-blue-600 border-solid rounded-lg table-tag-badge`}
              >
                <div className="absolute left-0 z-10 flex items-center justify-center p-1 text-blue-100 -translate-x-1/2 -translate-y-1/2 bg-blue-700 rounded-full aspect-square top-1/2">
                  {curerntBill.takeAway ? (
                    <MdShoppingBag size={16} />
                  ) : curerntBill.tableList.length > 1 ? (
                    <BlockOutlined rev="" />
                  ) : (
                    <MdTableRestaurant size={16} />
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {!curerntBill.takeAway && curerntBill.tableList.length > 0 ? (
                    <>
                      {[...curerntBill.tableList].sort(alphabetCompare)[0].name}
                      <span className="font-normal text-gray-400">
                        {curerntBill.tableList.length > 1 ? ` (+${curerntBill.tableList.length - 1})` : ''}
                      </span>
                    </>
                  ) : (
                    <>Takeaway</>
                  )}
                </div>
              </div>
              <div
                className={`relative flex items-center justify-center gap-2 py-1 pl-6 pr-4 text-sm font-semibold text-blue-700 duration-1000 bg-blue-100 border-2 border-blue-600 border-solid rounded-lg table-tag-badge`}
              >
                <div className="absolute left-0 z-10 flex items-center justify-center p-1 text-blue-100 -translate-x-1/2 -translate-y-1/2 bg-blue-700 rounded-full aspect-square top-1/2">
                  <MdPerson size={16} />
                </div>
                <div className="flex items-center gap-2">{curerntBill.cashier}</div>
              </div>
            </div>
          </div>
          <div className="ml-2 mr-2 border-0 border-t border-solid border-slate-200"></div>
          <div className="pl-3 pr-2 grow order-details">
            {curerntBill.orderDetailList.length > 0 ? (
              <Spin tip={'Loading...'} spinning={false} className="h-full grow">
                <Scrollbars className="w-full grow">
                  <div className="flex flex-col-reverse gap-2 pt-2 pr-4">
                    {curerntBill.orderDetailList
                      .filter(detail => detail.quantity > 0)
                      .map((detail, index) => (
                        <OrderDetailCard key={detail.id} detail={detail} index={index + 1} />
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
                  <Translate contentKey="order.empty.title" />
                </Typography.Title>
                <Typography.Text className="text-gray-500">
                  <Translate contentKey="order.empty.subtitle" />
                </Typography.Text>
              </motion.div>
            )}
          </div>
          <div className="flex flex-col px-4 py-6 mb-2 ml-2 mr-4 border-0 border-t border-solid rounded-lg bg-blue-50 border-t-slate-200">
            <div className="flex items-center justify-between ">
              <Typography.Text>
                <Translate contentKey="order.charge.subtotal" />
              </Typography.Text>
              <Typography.Text className="font-semibold !m-0">
                {curerntBill.id && <CurrencyFormat>{curerntBill.sumMoney}</CurrencyFormat>}
              </Typography.Text>
            </div>
            <div className="flex items-center justify-between mb-4">
              <Typography.Text>
                <Translate contentKey="order.charge.discount" />
              </Typography.Text>
              <Typography.Text className="font-semibold !m-0">
                {curerntBill.id && (
                  <>
                    - <CurrencyFormat>{curerntBill.discount}</CurrencyFormat>
                  </>
                )}
              </Typography.Text>
            </div>
            <div className="flex items-center justify-between ">
              <Typography.Text className="font-semibold">
                <Translate contentKey="order.orderDetails.total" />
              </Typography.Text>
              <Typography.Title level={4} className="font-semibold !m-0">
                <CurrencyFormat>
                  {curerntBill.orderDetailList.map(detail => detail.quantity * detail.menuItem.sellPrice).reduce((a, b) => a + b, 0)}
                </CurrencyFormat>
              </Typography.Title>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailCard = ({
  detail,
  index,
}: {
  detail: IOrderDetail;
  index: number;
  onAddNote?: any;
  handelAdjustQuantity?: any;
  handleDuplicateItem?: any;
  handleDeleteItem?: any;
  openNumbericKeyboard?: any;
}) => {
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
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600 w-fit">
            <div className="min-w-[40px] flex gap-1.5 justify-center items-end cursor-pointer">
              <Typography.Text className={`!m-0`}>{'x ' + detail.quantity}</Typography.Text>
            </div>
          </div>
          <span className="font-semibold">
            <CurrencyFormat>{detail.menuItem.sellPrice * detail.quantity}</CurrencyFormat>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BillDetails;
