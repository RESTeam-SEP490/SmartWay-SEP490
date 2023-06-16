import { ApartmentOutlined, BarsOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, MenuItemProps, MenuProps } from 'antd';
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems';
import { IconType } from 'antd/es/notification/interface';
import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const UserMenu = () => {
  const location = useLocation();

  return (
    <Menu selectedKeys={location.pathname.split('/')} mode="horizontal" className="justify-center py-1 shadow-sm">
      <Menu.SubMenu title={translate('menu.usermanagement.label')} icon={<TeamOutlined rev={TeamOutlined} />}>
        <Menu.Item key="users" icon={<UserOutlined rev={UserOutlined} />}>
          <Translate contentKey="menu.usermanagement.submenu.users" />
          <Link to="/manage/users" />
        </Menu.Item>
        <Menu.Item key="roles" icon={<ApartmentOutlined rev={ApartmentOutlined} />}>
          <Translate contentKey="menu.usermanagement.submenu.roles" />
          <Link to="/manage/roles" />
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="menu" icon={<BarsOutlined rev={ApartmentOutlined} />}>
        <Translate contentKey="menu.menumanagement.label" />
        <Link to="/management/menu" />
      </Menu.Item>
    </Menu>
  );
};
