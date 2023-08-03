import { Button, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IItemAdditionNotification } from 'app/shared/model/order/item-addition-notfication.model';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import dayjs from 'dayjs';
import { DoubleRightOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import { IKitchenItems } from 'app/shared/model/dto/kitchen-items-dto';
import { itemAdditionCompare } from 'app/app.constant';
import { kitchenActions } from '../kitchen.reducer';
import { AnimatePresence, motion } from 'framer-motion';

export const PreparingItems = () => {
  const dispatch = useAppDispatch();

  const kitchenItems: IKitchenItems = useAppSelector(state => state.kitchen.kitchenItems);
  const preparingItems = [...kitchenItems.itemAdditionNotificationList].sort(itemAdditionCompare);
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
                className="flex justify-between py-6 pl-4 pr-2 mr-4 border-solid"
                key={item.id}
              >
                <div className="flex flex-col justify-between w-1/3">
                  <Typography.Title className="!m-0 !leading-none w-full" level={5} ellipsis={{ tooltip: item.menuItemName }}>
                    {item.menuItemName}
                  </Typography.Title>
                  {item.note && <div className="text-sm text-yellow-600">{item.note}</div>}
                  <div className="mt-1 text-xs text-gray-500">
                    {dayjs(item.notifiedTime).format('L LT') + ` - ${'Bởi'} `}
                    <span className="text-blue-600">{item.createdBy}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="">{`${item.tableList.map(table => table.name)[0]}${
                    item.tableList.length > 1 ? ` + ${item.tableList.length - 1}` : ''
                  }`}</div>
                  <div className="text-xs text-gray-500">{dayjs(item.notifiedTime).from(now)}</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-lg text-yellow-600">
                    {item.priority && <StarFilled rev={''} />}
                  </div>
                  <span>{item.quantity}</span>
                </div>
                <div className="flex gap-2">
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
                        kitchenActions.notifyReadyToServe({ itemAdditionNotificationId: item.id, readyToServeQuantity: item.quantity })
                      )
                    }
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Scrollbars>
    </div>
  );
};
