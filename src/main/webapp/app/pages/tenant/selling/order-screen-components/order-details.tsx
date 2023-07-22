import {
  DeleteFilled,
  EditFilled,
  FileOutlined,
  MinusCircleFilled,
  MinusOutlined,
  MinusSquareFilled,
  PlusCircleFilled,
  PlusCircleOutlined,
  PlusOutlined,
  PlusSquareFilled,
  StarFilled,
} from '@ant-design/icons';
import { Button, Image, Typography } from 'antd';
import { currencyFormatter } from 'app/app.constant';
import { useAppSelector } from 'app/config/store';
import { IMenuItem } from 'app/shared/model/menu-item.model';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { MdMonetizationOn, MdOutlineFastfood, MdRoomService } from 'react-icons/md';

export const OrderDetails = () => {
  const menuItemList = useAppSelector(state => state.menuItem.entities);

  return (
    <>
      <div className="flex flex-col divide-y divide-slate-200 p-2 h-screen w-[464px] bg-white">
        <div className="p-4">
          <Typography.Title level={3} className="!mb-0">
            Current Order
          </Typography.Title>
          <Typography.Title level={5} className="!m-0 !text-slate-400">
            Bàn 4
          </Typography.Title>
        </div>
        <div className="border-t border-0 border-solid border-slate-200 ml-2 mr-4"></div>
        <div className="pl-3 pt-2 grow">
          <Scrollbars className="grow w-full">
            <div className="flex flex-col gap-3 pr-4">{menuItemList.map(table => OrderDetailCard(table))}</div>
          </Scrollbars>
        </div>
        <div className="border-t border-0 border-solid border-slate-200 ml-2 mr-4"></div>
        <div className="ml-2 mr-4 p-2 pb-0 flex justify-between items-center">
          <Typography.Title level={4} className="font-semibold">
            Total
          </Typography.Title>
          <Typography.Title level={4} className="font-semibold !text-blue-600 !mt-0">
            {currencyFormatter(200000)}
          </Typography.Title>
        </div>
        <div className="flex mb-2 p-2 pr-4 gap-2">
          <Button
            icon={<MdMonetizationOn size={20} />}
            size="large"
            type="primary"
            className="grow flex items-center justify-center bg-green-600 hover:!bg-green-500 active:!bg-green-700"
          >
            Thanh toán
          </Button>
          <Button size="large" type="primary" className="grow flex items-center justify-center " icon={<MdRoomService size={20} />}>
            Báo bếp
          </Button>
        </div>
      </div>
    </>
  );
};

const OrderDetailCard = (item: IMenuItem) => (
  <div
    key={item.id}
    className="flex items-center p-2 w-full h-24  text-blue-600 bg-white rounded-lg
     border border-solid border-transparent hover:border-blue-200 hover:shadow-md"
  >
    <div className="h-full aspect-square bg-blue-100 flex items-center justify-center overflow-hidden rounded-md relative">
      {item.imageUrl ? (
        <>
          <Image
            preview={false}
            src={item.imageUrl}
            className="overflow-hidden w-full h-full none-draggable"
            fallback="data:image/png;base64,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"
          />
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
    <div className="grow h-full px-4 flex flex-col justify-between">
      <Typography.Text className="text font-semibold w-full" ellipsis={{ tooltip: item.name }}>
        {item.name}
      </Typography.Text>
      <Button type="text" className="!p-0 !w-full !h-6 text-left hover:!bg-transparent text-gray-400" icon={<FileOutlined rev={''} />}>
        Nhập ghi chú...
      </Button>
      <div className="flex justify-between items-center">
        <div className="flex w-fit items-center text-blue-600">
          <Button
            type="primary"
            size="small"
            className="!p-0 !w-5 !h-5 aspect-square shadow-none flex justify-center items-center"
            icon={<MinusOutlined rev={''} />}
          />
          <Typography.Text className="min-w-[36px] text-center">6</Typography.Text>
          <Button
            type="primary"
            size="small"
            className="!p-0 !w-5 !h-5 aspect-square shadow-none flex justify-center items-center"
            icon={<PlusOutlined rev={''} />}
          />
        </div>
        <span className="font-semibold">{currencyFormatter(item.sellPrice)}</span>
      </div>
    </div>
    <div className="flex flex-col gap-1">
      <Button
        danger
        className="!h-9 !w-9 rounded-lg shadow-none border-none aspect-square bg-red-100 !text-red-600 "
        icon={<DeleteFilled rev={''} />}
      />
      <Button
        className="!h-9 !w-9 rounded-lg shadow-none border-none aspect-square bg-blue-100 !text-blue-600"
        icon={<PlusOutlined rev={''} />}
      />
    </div>
  </div>
);
