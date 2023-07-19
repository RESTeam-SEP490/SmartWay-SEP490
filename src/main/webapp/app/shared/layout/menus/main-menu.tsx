import {
  ApartmentOutlined,
  AppstoreOutlined,
  ControlOutlined,
  FileTextOutlined,
  ProfileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { AUTHORITIES } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import React, { useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { Link, useLocation } from 'react-router-dom';
import {
  MdOutlineManageAccounts,
  MdOutlineGroups,
  MdOutlineFastfood,
  MdOutlineTableRestaurant,
  MdOutlineReceiptLong,
  MdOutlineGroup,
  MdOutlineTune,
  MdOutlineDashboard,
} from 'react-icons/md';

export const UserMenu = () => {
  const location = useLocation();
  const { authorities } = useAppSelector(state => state.authentication.account);
  const [isCollapse, setIsCollapse] = useState(false);

  const isHiddenWithAuthority = (requiredAuthorities: string[]) => {
    if (authorities && authorities.length !== 0) {
      if (requiredAuthorities.length === 0) {
        return false;
      }
      return !requiredAuthorities.some(auth => authorities.includes(auth));
    }
    return true;
  };

  return (
    <div
      className={`border-0 border-solid border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-collapse ${
        isCollapse ? 'w-20' : '!w-56'
      }`}
    >
      {/* <div className="border-b border-blue-300 border-solid"></div> */}

      <Menu selectedKeys={[location.pathname.split('/').pop()]} mode="inline" className="justify-center py-4" inlineCollapsed={isCollapse}>
        <Menu.Item
          key="dashboard"
          icon={<MdOutlineDashboard size={24} />}
          hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF_VIEW])}
        >
          <Translate contentKey="menu.dashboard.label" />
          <Link to="/dashboard" />
        </Menu.Item>
        <Menu.SubMenu
          title={translate('menu.staff.label')}
          icon={<MdOutlineGroups size={24} />}
          className={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF_VIEW, AUTHORITIES.STAFFROLE_VIEW]) && 'hidden'}
        >
          <Menu.Item
            key="staff"
            icon={<MdOutlineGroup size={24} />}
            hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF_VIEW])}
          >
            <Translate contentKey="menu.staff.submenu.staffs" />
            <Link to="/staff" />
          </Menu.Item>
          <Menu.Item
            key="roles"
            icon={<MdOutlineManageAccounts size={24} />}
            hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFFROLE_VIEW])}
          >
            <Translate contentKey="menu.staff.submenu.roles" />
            <Link to="/roles" />
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key="menu-items"
          icon={<MdOutlineFastfood size={24} />}
          hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.MENUITEM_VIEW])}
        >
          <Translate contentKey="menu.foodMenu.label" />
          <Link to="/menu-items" />
        </Menu.Item>
        <Menu.Item
          key="tables"
          icon={<MdOutlineTableRestaurant size={24} />}
          hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.TABLE_VIEW])}
        >
          <Translate contentKey="menu.table.label" />
          <Link to="/tables" />
        </Menu.Item>
        <Menu.Item
          key="bills"
          icon={<MdOutlineReceiptLong size={24} />}
          hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.BILL_VIEW])}
        >
          <Translate contentKey="menu.bill.label" />
          <Link to="/bills" />
        </Menu.Item>
      </Menu>
      <div className="mx-4 h-16 border-t border-solid border-0 border-slate-200 ">
        <Button onClick={() => setIsCollapse(prev => !prev)} className="!shadow-none px-1 float-right mr-2 my-4 text-slate-400">
          <MdOutlineTune size={24} />
        </Button>
      </div>
    </div>
  );
};
