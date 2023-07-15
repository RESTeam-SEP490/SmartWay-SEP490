import React from 'react';
import { Translate } from 'react-jhipster';

import { NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from 'antd';

export const BrandIcon = props => (
  <div className="flex items-center justify-center gap-2 ">
    <div {...props} className="translate-y-1">
      <img src="content/images/SW_logo.svg" alt="Logo" width={48} />
    </div>
    <Typography.Title level={3} className="!m-0">
      <span className=" text-slate-400">Smart</span>
      <span className="text-blue-600 ">Way</span>
    </Typography.Title>
  </div>
);

export const Brand = () => (
  <Link to="/" className="no-underline cursor-pointer">
    <BrandIcon />
  </Link>
);
