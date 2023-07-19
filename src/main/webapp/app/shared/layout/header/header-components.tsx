import React from 'react';
import { Translate } from 'react-jhipster';

import { NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from 'antd';

type BrandType = 'primary' | 'white';

export const BrandIcon = ({ type = 'primary', isHiddenText = false, ...props }) => (
  <div {...props}>
    <div className="flex items-center justify-center gap-2 ">
      <div className="translate-y-1">
        <img src={type === 'primary' ? 'content/images/SW_logo.svg' : 'content/images/SW_logo_white.svg'} alt="Logo" width={48} />
      </div>
      <Typography.Title level={3} className="!m-0" hidden={isHiddenText}>
        <span className={type === 'primary' ? ' text-slate-400' : 'text-white'}>Smart</span>
        <span className={type === 'primary' ? ' text-blue-600' : 'text-white'}>Way</span>
      </Typography.Title>
    </div>
  </div>
);

export const Brand = () => (
  <Link to="/" className="no-underline cursor-pointer">
    <BrandIcon />
  </Link>
);
