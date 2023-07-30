import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import PageNotFound from 'app/shared/error/page-not-found';
import OrderScreen from './order/order';
import { Storage } from 'react-jhipster';
import { useState } from 'react';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { Button, Menu } from 'antd';
import { MdOutlineDisplaySettings, MdOutlineTune } from 'react-icons/md';

export default () => {
  const [isCollapse, setIsCollapse] = useState(Storage.local.get('isCollapse', true));

  const handleCollapse = () => {
    Storage.local.set('isCollapse', !isCollapse);
    setIsCollapse(!isCollapse);
  };
  return (
    <div className="bg-gray-100 grow">
      <div className="flex h-full">
        <div
          className={` bg-blue-600 flex flex-col pt-2 justify-between transition-all duration-300 ease-in-collapse ${
            isCollapse ? 'w-20' : '!w-48'
          }`}
        >
          <div className="">
            <div className="px-3">
              <BrandIcon type="white" isHiddenText={isCollapse} />
            </div>
            <Menu mode="inline" theme="dark" className="bg-blue-600 !text-white pt-4" inlineCollapsed={isCollapse}>
              <Menu.Item icon={<MdOutlineDisplaySettings size={24} />}>Table</Menu.Item>
              {/* <Menu.Item icon={<FileTextOutlined className="!text-xl" rev={''} />}>Table</Menu.Item> */}
            </Menu>
          </div>
          <div className="h-16 mx-4 border-0 border-t border-solid border-slate-200 ">
            <Button onClick={handleCollapse} type="primary" className="!shadow-none px-1 float-right mr-2 my-4">
              <MdOutlineTune size={24} />
            </Button>
          </div>
        </div>{' '}
        <div className="grow">
          <ErrorBoundaryRoutes>
            <Route path="orders" element={<OrderScreen />} />
            {/* <Route path="*" element={<PageNotFound />} /> */}
          </ErrorBoundaryRoutes>
        </div>
      </div>
    </div>
  );
};
