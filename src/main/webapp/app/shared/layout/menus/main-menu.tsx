import {
  ApartmentOutlined,
  AppstoreOutlined,
  DesktopOutlined,
  FileTextOutlined,
  ProfileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { AUTHORITIES } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Link, useLocation } from 'react-router-dom';

export const UserMenu = () => {
  const location = useLocation();
  const { authorities } = useAppSelector(state => state.authentication.account);
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
    <>
      <div className="border-b border-blue-300 border-solid"></div>
      <div className="border-b-2 border-blue-600 border-solid "></div>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="grow">
          <Menu selectedKeys={[location.pathname.split('/').pop()]} mode="horizontal" className="justify-center py-1">
            <Menu.SubMenu
              title={translate('menu.staff.label')}
              icon={<TeamOutlined className="!text-lg" rev={''} />}
              className={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF_VIEW, AUTHORITIES.STAFFROLE_VIEW]) && 'hidden'}
            >
              <Menu.Item
                key="staff"
                icon={<UserOutlined className="!text-lg" rev={''} />}
                hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF_VIEW])}
              >
                <Translate contentKey="menu.staff.submenu.staffs" />
                <Link to="/staff" />
              </Menu.Item>
              <Menu.Item
                key="roles"
                icon={<ApartmentOutlined className="!text-lg" rev={''} />}
                hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFFROLE_VIEW])}
              >
                <Translate contentKey="menu.staff.submenu.roles" />
                <Link to="/roles" />
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.Item
              key="menu-items"
              icon={<ProfileOutlined className="!text-lg" rev={''} />}
              hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.MENUITEM_VIEW])}
            >
              <Translate contentKey="menu.foodMenu.label" />
              <Link to="/menu-items" />
            </Menu.Item>
            <Menu.Item
              key="tables"
              icon={<AppstoreOutlined className="!text-lg" rev={''} />}
              hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.TABLE_VIEW])}
            >
              <Translate contentKey="menu.table.label" />
              <Link to="/tables" />
            </Menu.Item>
            <Menu.Item
              key="bills"
              icon={<FileTextOutlined className="!text-lg" rev={''} />}
              hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.BILL_VIEW])}
            >
              <Translate contentKey="menu.bill.label" />
              <Link to="/bills" />
            </Menu.Item>
          </Menu>
        </div>
        <div className="">
          <Button type="primary" icon={<DesktopOutlined rev={''} />}>
            POS Screen
          </Button>
        </div>
      </div>
    </>
  );
};
