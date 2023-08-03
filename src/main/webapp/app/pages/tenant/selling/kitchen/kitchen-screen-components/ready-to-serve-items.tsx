import { DoubleRightOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import { Button, ConfigProvider, Typography } from 'antd';
import { readyToServeItemCompare } from 'app/app.constant';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IKitchenItems } from 'app/shared/model/dto/kitchen-items-dto';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { kitchenActions } from '../kitchen.reducer';
import { AnimatePresence, motion } from 'framer-motion';

export const ReadyToServeItems = () => {
  const dispatch = useAppDispatch();

  const kitchenItems: IKitchenItems = useAppSelector(state => state.kitchen.kitchenItems);
  const preparingItems = [...kitchenItems.readyToServeNotificationList].sort(readyToServeItemCompare);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col pl-4 py-4 bg-white rounded-b-lg rounded-se-lg h-[calc(100vh-60px)] ">
      <Scrollbars className="w-full grow">
        <div className="">
          <AnimatePresence>
            {preparingItems.map(item => (
              <motion.div
                layout
                initial={{ opacity: 0, x: '-50%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, x: '50%' }}
                className="flex justify-between py-6 pl-4 pr-2 mr-4"
                key={item.id}
              >
                <div className="flex flex-col justify-between w-1/3">
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
                    {dayjs(item.notifiedTime).format('L LT') + ` - ${'Bởi'} `}
                    <span className="text-blue-600">{item.createdBy}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="">{`${item.itemAdditionNotification.tableList.map(table => table.name)[0]}${
                    item.itemAdditionNotification.tableList.length > 1 ? ` + ${item.itemAdditionNotification.tableList.length - 1}` : ''
                  }`}</div>
                  <div className="text-xs text-gray-600">
                    <span className="text-blue-600">{item.createdBy}</span>
                    {`${'xong'} ${dayjs(item.notifiedTime).from(now)}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-lg text-yellow-600">
                    {item.itemAdditionNotification.priority && <StarFilled rev={''} />}
                  </div>
                  <span>{item.quantity}</span>
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
                    <Button
                      type="primary"
                      ghost
                      className="!w-12"
                      icon={<RightOutlined rev="" />}
                      onClick={() => dispatch(kitchenActions.notifyServed({ readyToServeNotificationId: item.id, servedQuantity: 1 }))}
                    />
                    <Button
                      type="primary"
                      className="!w-12"
                      icon={<DoubleRightOutlined rev="" />}
                      onClick={() =>
                        dispatch(kitchenActions.notifyServed({ readyToServeNotificationId: item.id, servedQuantity: item.quantity }))
                      }
                    />
                  </ConfigProvider>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Scrollbars>
    </div>
  );
};
