import { DeleteFilled, DoubleRightOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { alphabetCompare, itemAdditionCompare } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IKitchenItems } from 'app/shared/model/dto/kitchen-items-dto';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { MdOutlineSoupKitchen, MdShoppingBag, MdTableRestaurant } from 'react-icons/md';
import { translate } from 'react-jhipster';
import { kitchenActions } from '../kitchen.reducer';
import { IItemAdditionNotification } from 'app/shared/model/order/item-addition-notfication.model';

export const PreparingItems = () => {
  const dispatch = useAppDispatch();

  const kitchenItems: IKitchenItems = useAppSelector(state => state.kitchen.kitchenItems);
  const categoryFilter = useAppSelector(state => state.kitchen.categoryFilter);
  const rootList = [...kitchenItems.itemAdditionNotificationList].sort(itemAdditionCompare);
  const [preparingItems, setPreparingItems] = useState([]);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPreparingItems(rootList.filter(item => categoryFilter.some(categoryId => categoryId === item.menuItem.menuItemCategory.id)));
  }, [categoryFilter, kitchenItems]);

  return (
    <div className="flex flex-col pl-4 py-4 bg-white rounded-b-lg rounded-se-lg h-[calc(100vh-80px)] ">
      {preparingItems.length === 0 ? (
        <>
          <div className="flex items-center justify-center w-full grow">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center text-blue-600 bg-blue-100 rounded-full w-44 h-44">
                <MdOutlineSoupKitchen size={80} />
              </div>
              <Typography.Title level={4} className="!text-gray-500 !mt-4">
                {translate('kitchen.preparingItems.empty')}
              </Typography.Title>
            </div>
          </div>
        </>
      ) : (
        <Scrollbars className="w-full grow">
          <div className="">
            <AnimatePresence mode="sync">
              {preparingItems.map((item: IItemAdditionNotification) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: '-50%' }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0, x: '50%' }}
                  className="flex justify-between py-6 pl-4 pr-2 mr-4"
                  key={item.id}
                >
                  <div className="flex flex-col w-1/3">
                    <Typography.Title className="!m-0 !leading-none w-full" level={5} ellipsis={{ tooltip: item.menuItem.name }}>
                      {item.menuItem.name}
                    </Typography.Title>
                    {item.note && <div className="text-sm text-yellow-600">{item.note}</div>}
                    <div className="mt-1 text-xs text-gray-500">
                      {dayjs(item.notifiedTime).format('L LT') + ` - ${translate('entity.label.by')} `}
                      <span className="text-blue-600">{item.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center w-6 h-6 text-lg text-yellow-600">
                      {item.priority && <StarFilled rev={''} />}
                    </div>
                    <span>
                      {[
                        ...item.readyToServeNotificationList.map(rts => rts.quantity),
                        ...item.itemCancellationNotificationList.map(icn => icn.quantity),
                      ].reduce<number>((prev, value) => {
                        return prev - value;
                      }, item.quantity)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between w-1/6 overflow-visible">
                    {item.tableList.length > 0 ? (
                      <div className="flex items-center gap-1 ">
                        <MdTableRestaurant className="text-gray-400" size={20} />
                        {`${[...item.tableList].sort(alphabetCompare).map(table => table.name)[0]}`}
                        {item.tableList.length > 1 && <span className="ml-2 text-blue-500">{`(+${item.tableList.length - 1})`}</span>}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 font-semibold text-yellow-600">
                        <MdShoppingBag size={20} />
                        {'#' + item.orderCode}
                      </div>
                    )}
                    <div className="text-xs text-gray-600">{dayjs(item.notifiedTime).from(now)}</div>
                    {item.itemCancellationNotificationList.length > 0 && (
                      <div className="mt-2 ">
                        {[...item.itemCancellationNotificationList]
                          .sort((a, b) => (dayjs(a.notifiedTime).isBefore(dayjs(b.notifiedTime)) ? -1 : 1))
                          .map(addition => (
                            <div key={addition.id} className="text-xs whitespace-nowrap">
                              {translate('entity.label.cancelled')}
                              <span className="text-base font-semibold text-red-600 mx-1.5">{addition.quantity}</span>
                              {translate('entity.label.by').toLowerCase()}
                              <span className="mx-1 text-sm text-blue-600">{addition.createdBy}</span>
                              {' ' + dayjs(addition.notifiedTime).from(now)}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 w-28">
                    {[
                      ...item.readyToServeNotificationList.map(rts => rts.quantity),
                      ...item.itemCancellationNotificationList.map(icn => icn.quantity),
                    ].reduce<number>((prev, value) => {
                      return prev - value;
                    }, item.quantity) === 0 ? (
                      <Button
                        type="primary"
                        danger
                        ghost
                        className="!aspect-square !bg-red-100"
                        icon={<DeleteFilled rev="" />}
                        onClick={() =>
                          dispatch(kitchenActions.notifyReadyToServe({ itemAdditionNotificationId: item.id, readyToServeQuantity: 0 }))
                        }
                      />
                    ) : (
                      <>
                        <Button
                          type="primary"
                          ghost
                          className="!w-12"
                          icon={<RightOutlined rev="" />}
                          onClick={() =>
                            dispatch(kitchenActions.notifyReadyToServe({ itemAdditionNotificationId: item.id, readyToServeQuantity: 1 }))
                          }
                        />
                        <Button
                          type="primary"
                          className="!w-12"
                          icon={<DoubleRightOutlined rev="" />}
                          onClick={() =>
                            dispatch(
                              kitchenActions.notifyReadyToServe({
                                itemAdditionNotificationId: item.id,
                                readyToServeQuantity: [
                                  ...item.readyToServeNotificationList.map(rts => rts.quantity),
                                  ...item.itemCancellationNotificationList.map(icn => icn.quantity),
                                ].reduce<number>((prev, value) => {
                                  return prev - value;
                                }, item.quantity),
                              })
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Scrollbars>
      )}
    </div>
  );
};
