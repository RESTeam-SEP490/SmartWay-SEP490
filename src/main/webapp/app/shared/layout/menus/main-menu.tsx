import {
  ApartmentOutlined,
  BarsOutlined,
  FullscreenOutlined,
  TeamOutlined,
  UserOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import { Button, Menu, MenuItemProps, MenuProps } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { IconType } from 'antd/es/notification/interface';
import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const location = useLocation();

  return (
    <>
      <div className="border-b border-blue-600 border-solid"></div>
      <div>
        <Menu selectedKeys={[location.pathname.split('/').pop()]} mode="horizontal" className="justify-center py-1 shadow-sm">
          <Menu.SubMenu title={translate('menu.staffmanagement.label')} icon={<TeamOutlined rev={TeamOutlined} />}>
            <Menu.Item key="users" icon={<UserOutlined rev={UserOutlined} />}>
              <Translate contentKey="menu.staffmanagement.label" />
              <Link to="/staffs" />
            </Menu.Item>
            <Menu.Item key="roles" icon={<ApartmentOutlined rev={ApartmentOutlined} />}>
              <Translate contentKey="menu.usermanagement.submenu.roles" />
              <Link to="/roles" />
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="menu-items" icon={<BarsOutlined rev={ApartmentOutlined} />}>
            <Translate contentKey="menu.menumanagement.label" />
            <Link to="/menu-items" />
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};
