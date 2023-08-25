import React, { useState } from 'react';
import { Link, Route, useLocation } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import OrderScreen from './order/order';
import { Storage, Translate } from 'react-jhipster';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { Button, Menu } from 'antd';
import { MdOutlineReceiptLong, MdOutlineRestaurantMenu, MdOutlineRoomService, MdOutlineTune } from 'react-icons/md';
import Kitchen from './kitchen/kitchen';
import { Bill } from './bill/bill';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import PageNotFound from 'app/shared/error/page-not-found';

export default () => {
  const location = useLocation();
  const username = useAppSelector(state => state.authentication.account.username);

  const { authorities } = useAppSelector(state => state.authentication.account);

  const isHiddenWithAuthority = (requiredAuthorities: string[]) => {
    return !hasAnyAuthority(authorities, requiredAuthorities) && !authorities.includes(AUTHORITIES.ADMIN);
  };

  const [isCollapse, setIsCollapse] = useState(Storage.local.get('isCollapse', true));

  const handleCollapse = () => {
    Storage.local.set('isCollapse', !isCollapse);
    setIsCollapse(!isCollapse);
  };

  return (
    <div className="h-screen bg-gray-100 grow">
      <div className="flex h-full">
        <div
          className={` bg-blue-600 flex flex-col pt-2 justify-between transition-all duration-300 ease-in-collapse ${
            isCollapse ? 'w-20' : '!w-48'
          }`}
        >
          <div className="">
            <div className="px-3 cursor-pointer">
              <Link to={'/'}>
                <BrandIcon type="white" isHiddenText={isCollapse} />
              </Link>
            </div>
            <Menu
              selectedKeys={[location.pathname]}
              mode="inline"
              theme="dark"
              className="bg-blue-600 !text-white pt-4"
              inlineCollapsed={isCollapse}
            >
              <Menu.Item
                icon={<MdOutlineRoomService size={24} />}
                key={'/pos/orders'}
                hidden={isHiddenWithAuthority([AUTHORITIES.ORDER_ADD_AND_CANCEL])}
              >
                <Translate contentKey="menu.order.label" />
                <Link to="/pos/orders" />
              </Menu.Item>
              <Menu.Item
                icon={<MdOutlineRestaurantMenu size={24} />}
                key={'/pos/kitchen'}
                hidden={isHiddenWithAuthority([AUTHORITIES.KITCHEN_PREPARING_ITEM, AUTHORITIES.KITCHEN_RTS_ITEM])}
              >
                <Translate contentKey="menu.kitchen.label" />
                <Link to="/pos/kitchen" />
              </Menu.Item>
              <Menu.Item
                key="/pos/bills"
                icon={<MdOutlineReceiptLong size={24} />}
                hidden={isHiddenWithAuthority([AUTHORITIES.BILL_FULL_ACCESS, AUTHORITIES.BILL_VIEW_ONLY])}
              >
                <Translate contentKey="menu.bill.label" />
                <Link to="/pos/bills" />
              </Menu.Item>
            </Menu>
          </div>
          <div className="">
            <div className="h-16 mx-4 border-0 border-t border-solid border-slate-200 ">
              <Button
                onClick={handleCollapse}
                icon={<MdOutlineTune size={24} />}
                type="primary"
                className="!shadow-none px-1 float-right mr-2 my-4"
              ></Button>
            </div>
          </div>
        </div>{' '}
        <div className="bg-blue-600 grow">
          <ErrorBoundaryRoutes>
            <Route path="orders" element={<OrderScreen />} />
            <Route path="kitchen" element={<Kitchen />} />
            <Route path="bills" element={<Bill />} />
            <Route path="*" element={<PageNotFound />} />
          </ErrorBoundaryRoutes>
        </div>
      </div>
    </div>
  );
};
