import { Button, Typography } from 'antd';
import { useAppSelector } from 'app/config/store';
import { IItemAdditionNotification } from 'app/shared/model/order/item-addition-notfication.model';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import dayjs from 'dayjs';
import { DoubleRightOutlined, RightOutlined, StarFilled } from '@ant-design/icons';

export const PreparingItems = () => {
  const preparingItems: IItemAdditionNotification[] = useAppSelector(state => state.kitchen.preparingItems);

  return (
    <div className="flex flex-col pl-4 py-4 bg-white rounded-b-lg rounded-se-lg h-[calc(100vh-60px)] ">
      <Scrollbars className="w-full grow">
        <div className="shadow-inner shadow-white">
          {preparingItems.map(item => (
            <div className="flex justify-between py-5 pl-4 pr-2 mr-4" key={item.id}>
              <div className="flex flex-col justify-between w-5/12">
                <Typography.Title className="!m-0 !leading-none w-full" level={5} ellipsis={{ tooltip: item.menuItemName }}>
                  {item.menuItemName}
                </Typography.Title>
                <div className="text-xs text-gray-600">{item.note ? item.note : 'Không có ghi chú'}</div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="">{`${item.tableList.map(table => table.name)[0]}${
                  item.tableList.length > 1 ? ` + ${item.tableList.length - 1}` : ''
                }`}</div>
                <div className="text-xs text-gray-600">
                  <span className="text-blue-600">{item.createdBy}</span>
                  {` ${'đã thêm'} ${dayjs(item.notifiedTime).fromNow()}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 text-lg text-yellow-600">
                  {item.priority && <StarFilled rev={''} />}
                </div>
                <span>{item.quantity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="primary"
                  ghost
                  className="hover:!bg-blue-600 !w-12 hover:!text-white"
                  icon={<RightOutlined rev="" />}
                ></Button>
                <Button
                  type="primary"
                  ghost
                  className="hover:!bg-blue-600 !w-12 hover:!text-white"
                  icon={<DoubleRightOutlined rev="" />}
                ></Button>
              </div>
            </div>
          ))}{' '}
        </div>
      </Scrollbars>
    </div>
  );
};
