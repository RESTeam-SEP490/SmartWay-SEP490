import { DownOutlined, FileTextOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import React from 'react';
import { Translate } from 'react-jhipster';
import { Link, useNavigate } from 'react-router-dom';

const accountMenuItemsAuthenticated = name => {
  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link to="account/profile">
          <Translate contentKey="global.menu.account.profile" />
        </Link>
      ),
      icon: <FileTextOutlined rev={FileTextOutlined} />,
    },
    {
      key: 'logout',
      label: (
        <Link to="logout">
          <Translate contentKey="global.menu.account.logout" />
        </Link>
      ),
      icon: <LogoutOutlined rev={LogoutOutlined} />,
    },
  ];
  return (
    <div className="flex items-center">
      <Typography.Text className="mr-4">{name}</Typography.Text>
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space className="">
          <Avatar shape="square" size="default" className="!bg-blue-500" icon={<UserOutlined rev={UserOutlined} />} />
          <DownOutlined rev={DownOutlined} className="text-xs ml-0.5" />
        </Space>
      </Dropdown>
    </div>
  );
};

const accountMenuItems = navigate => (
  <div className="flex gap-2">
    <Button size="large" type="primary" ghost onClick={() => navigate('/login')}>
      <Translate contentKey="global.menu.account.login">Sign in</Translate>
    </Button>{' '}
    <Button size="large" type="primary" onClick={() => navigate('/account/register')}>
      <Translate contentKey="global.menu.account.register">Register</Translate>
    </Button>
  </div>
);

export const AccountMenu = ({ isAuthenticated = false, name }) => {
  const navigate = useNavigate();

  return <>{isAuthenticated ? accountMenuItemsAuthenticated(name) : accountMenuItems(navigate)}</>;
};

export default AccountMenu;
