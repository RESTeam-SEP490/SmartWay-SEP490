import { Button, Menu } from 'antd';
import { AUTHORITIES } from 'app/config/constants';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import React, { useState } from 'react';
import {
  MdOutlineDashboard,
  MdOutlineFastfood,
  MdOutlineGroup,
  MdOutlineGroups,
  MdOutlineManageAccounts,
  MdOutlineTableRestaurant,
  MdOutlineTune,
} from 'react-icons/md';
import { Storage, Translate, translate } from 'react-jhipster';
import { Link, useLocation } from 'react-router-dom';

export const UserMenu = () => {
  const location = useLocation();
  const [isCollapse, setIsCollapse] = useState(Storage.local.get('isCollapse', true));
  const { authorities } = useAppSelector(state => state.authentication.account);

  const isHiddenWithAuthority = (requiredAuthorities: string[]) => {
    return !hasAnyAuthority(authorities, requiredAuthorities);
  };

  const handleCollapse = () => {
    Storage.local.set('isCollapse', !isCollapse);
    setIsCollapse(!isCollapse);
  };

  return (
    <div
      className={`border-0 border-solid border-r border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-collapse ${
        isCollapse ? 'w-20' : '!w-56'
      }`}
    >
      <Menu selectedKeys={[location.pathname.split('/').pop()]} mode="inline" className="justify-center py-4" inlineCollapsed={isCollapse}>
        <Menu.Item
          key="dashboard"
          icon={<MdOutlineDashboard size={24} />}
          hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF])}
        >
          <Translate contentKey="menu.dashboard.label" />
          <Link to="/managing/dashboard" />
        </Menu.Item>
        <Menu.SubMenu
          title={translate('menu.staff.label')}
          icon={<MdOutlineGroups size={24} />}
          className={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF, AUTHORITIES.STAFFROLE]) && 'hidden'}
        >
          <Menu.Item key="staff" icon={<MdOutlineGroup size={24} />} hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFF])}>
            <Translate contentKey="menu.staff.submenu.staffs" />
            <Link to="/managing/staff" />
          </Menu.Item>
          <Menu.Item
            key="roles"
            icon={<MdOutlineManageAccounts size={24} />}
            hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.STAFFROLE])}
          >
            <Translate contentKey="menu.staff.submenu.roles" />
            <Link to="/managing/roles" />
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key="menu-items"
          icon={<MdOutlineFastfood size={24} />}
          hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.MENUITEM])}
        >
          <Translate contentKey="menu.foodMenu.label" />
          <Link to="/managing/menu-items" />
        </Menu.Item>
        <Menu.Item
          key="tables"
          icon={<MdOutlineTableRestaurant size={24} />}
          hidden={isHiddenWithAuthority([AUTHORITIES.ADMIN, AUTHORITIES.TABLE])}
        >
          <Translate contentKey="menu.table.label" />
          <Link to="/managing/tables" />
        </Menu.Item>
      </Menu>
      <div className="h-16 mx-4 border-0 border-t border-solid border-slate-200 ">
        <Button onClick={handleCollapse} className="!shadow-none px-1 float-right mr-2 my-4 text-slate-400">
          <MdOutlineTune size={24} />
        </Button>
      </div>
    </div>
  );
};
