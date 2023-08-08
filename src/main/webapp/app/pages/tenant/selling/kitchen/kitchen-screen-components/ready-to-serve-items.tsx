import { DeleteFilled, DoubleRightOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import { Button, ConfigProvider, Typography } from 'antd';
import { alphabetCompare, readyToServeItemCompare } from 'app/app.constant';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IKitchenItems } from 'app/shared/model/dto/kitchen-items-dto';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { kitchenActions } from '../kitchen.reducer';
import { translate } from 'react-jhipster';
import { MdOutlineRamenDining, MdOutlineSoupKitchen } from 'react-icons/md';

export const ReadyToServeItems = () => {
  const dispatch = useAppDispatch();

  const kitchenItems: IKitchenItems = useAppSelector(state => state.kitchen.kitchenItems);
  const rtsItems = [...kitchenItems.readyToServeNotificationList].sort(readyToServeItemCompare);
  const [now, setNow] = useState(dayjs());
  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col pl-4 py-4 bg-white rounded-b-lg rounded-se-lg h-[calc(100vh-80px)] ">
      {rtsItems.length === 0 ? (
        <>
          <div className="flex items-center justify-center w-full grow">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center text-blue-600 bg-blue-100 rounded-full w-44 h-44">
                <MdOutlineRamenDining size={80} />
              </div>
              <Typography.Title level={4} className="!text-gray-500 !mt-4">
                {translate('kitchen.rtsItems.empty')}
              </Typography.Title>
            </div>
          </div>
        </>
      ) : (
        <Scrollbars className="w-full grow">
          <div className="">
            <AnimatePresence>
              {rtsItems.map(item => (
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
                    <Typography.Title
                      className="!m-0 !leading-none w-full"
                      level={5}
                      ellipsis={{ tooltip: item.itemAdditionNotification.menuItemName }}
                    >
                      {item.itemAdditionNotification.menuItemName}
                    </Typography.Title>
                    {item.itemAdditionNotification.note && (
                      <div className="text-xs text-yellow-600">{item.itemAdditionNotification.note}</div>
                    )}
                    <div className="mt-1 text-xs text-gray-500">
                      {dayjs(item.notifiedTime).format('L LT') + ` - ${translate('entity.label.by')} `}
                      <span className="text-blue-600">{item.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center w-6 h-6 text-lg text-yellow-600">
                      {item.itemAdditionNotification.priority && <StarFilled rev={''} />}
                    </div>
                    <span>
                      {[...item.itemCancellationNotificationList.map(icn => icn.quantity)].reduce<number>((prev, value) => {
                        return prev - value;
                      }, item.quantity - item.servedQuantity)}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between w-1/6 overflow-visible">
                    <div className="">
                      {`${[...item.itemAdditionNotification.tableList].sort(alphabetCompare).map(table => table.name)[0]}`}
                      {item.itemAdditionNotification.tableList.length > 1 && (
                        <span className="ml-2 text-blue-500">{`(+${item.itemAdditionNotification.tableList.length - 1})`}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 whitespace-nowrap">{`${translate('kitchen.rtsItems.done')} ${dayjs(
                      item.notifiedTime
                    ).from(now)}`}</div>
                    {item.itemCancellationNotificationList.length > 0 && (
                      <div className="mt-2 whitespace-nowrap">
                        {item.itemCancellationNotificationList.map(cancellation => (
                          <div key={cancellation.id} className="text-xs whitespace-nowrap">
                            {translate('entity.label.cancelled')}
                            <span className="text-base font-semibold text-red-600 mx-1.5">{cancellation.quantity}</span>
                            {translate('entity.label.by').toLowerCase()}
                            <span className="mx-1 text-sm text-blue-600">{cancellation.createdBy}</span>
                            {' ' + dayjs(item.notifiedTime).from(now)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <ConfigProvider
                      theme={{
                        token: {
                          colorPrimary: colors.green[600],
                          colorPrimaryHover: colors.green[500],
                          colorPrimaryActive: colors.green[700],
                        },
                      }}
                    >
                      {' '}
                      {[...item.itemCancellationNotificationList.map(icn => icn.quantity)].reduce<number>((prev, value) => {
                        return prev - value;
                      }, item.quantity - item.servedQuantity) === 0 ? (
                        <Button
                          type="primary"
                          danger
                          ghost
                          className="!aspect-square !bg-red-100"
                          icon={<DeleteFilled rev="" />}
                          onClick={() => dispatch(kitchenActions.notifyServed({ readyToServeNotificationId: item.id, servedQuantity: 0 }))}
                        />
                      ) : (
                        <>
                          <Button
                            type="primary"
                            ghost
                            className="!w-12"
                            icon={<RightOutlined rev="" />}
                            onClick={() =>
                              dispatch(kitchenActions.notifyServed({ readyToServeNotificationId: item.id, servedQuantity: 1 }))
                            }
                          />
                          <Button
                            type="primary"
                            className="!w-12"
                            icon={<DoubleRightOutlined rev="" />}
                            onClick={() =>
                              dispatch(kitchenActions.notifyServed({ readyToServeNotificationId: item.id, servedQuantity: item.quantity }))
                            }
                          />
                        </>
                      )}
                    </ConfigProvider>
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
