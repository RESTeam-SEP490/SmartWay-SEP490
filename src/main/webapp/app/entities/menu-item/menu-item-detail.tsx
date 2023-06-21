import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './menu-item.reducer';
import menuItem from 'app/entities/menu-item/menu-item.reducer';
import { IMenuItem } from '../../shared/model/menu-item.model';
import { Tabs } from 'antd';

export const MenuItemDetail = ({ menuItem: IMenuItem }) => {
  return (
    <>
      <Tabs>
        <Tabs.TabPane tab={translate('menuItem.infoTabs.information')} key={1}>
          Hahah
        </Tabs.TabPane>
        <Tabs.TabPane tab={translate('menuItem.infoTabs.sold')} key={2}>
          Hahah1
        </Tabs.TabPane>
        <Tabs.TabPane tab={translate('menuItem.infoTabs.ingredients')} key={3}>
          Hahah2
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default MenuItemDetail;
