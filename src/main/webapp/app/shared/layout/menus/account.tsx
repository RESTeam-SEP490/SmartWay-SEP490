import { DownOutlined, FileTextOutlined, LogoutOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { useAppSelector } from 'app/config/store';
import { RedirectLoginModal } from 'app/modules/login/redirect-login-modal';
import React, { useState } from 'react';
import { Translate } from 'react-jhipster';
import { Link, useNavigate } from 'react-router-dom';

export const AuthenticatedAccountMenu = () => {
  const username = useAppSelector(state => state.authentication.account.username);

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Link to="/profile">
          <Translate contentKey="global.menu.account.profile" />
        </Link>
      ),
      icon: <FileTextOutlined rev={FileTextOutlined} />,
    },
    {
      key: 'restaurant',
      label: (
        <Link to="/restaurant-setting">
          <Translate contentKey="global.menu.account.restaurant" />
        </Link>
      ),
      icon: <ShopOutlined rev={FileTextOutlined} />,
    },
    {
      key: 'logout',
      label: (
        <Link to="/logout">
          <Translate contentKey="global.menu.account.logout" />
        </Link>
      ),
      icon: <LogoutOutlined rev={LogoutOutlined} />,
    },
  ];
  return (
    <Dropdown menu={{ items }} placement="bottomRight" className="!text-base">
      <div className="flex items-center p-2 text-base cursor-pointer">
        <span className="mr-4 ">{username}</span>
        <Avatar shape="square" size="default" className="!bg-blue-600" icon={<UserOutlined rev={UserOutlined} />} />
        <DownOutlined rev={DownOutlined} className="ml-1 text-xs" />
      </div>
    </Dropdown>
  );
};

export const AccountMenu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RedirectLoginModal isOpen={isOpen} handleClose={() => setIsOpen(false)} />
      <div className="flex gap-2">
        <Button size="large" type="primary" ghost onClick={() => setIsOpen(true)} className="!w-32 !font-semibold">
          <Translate contentKey="global.menu.account.login">Sign in</Translate>
        </Button>{' '}
        <Button size="large" type="primary" onClick={() => navigate('/register')} className="!w-32 !font-semibold">
          <Translate contentKey="global.menu.account.register">Register</Translate>
        </Button>
      </div>
    </>
  );
};

// export const AccountMenu = ({ isAuthenticated = false, name }) => {
//   const navigate = useNavigate();

//   return <>{isAuthenticated ? accountMenuItemsAuthenticated(name) : accountMenuItems()}</>;
// };

// export default AccountMenu;
