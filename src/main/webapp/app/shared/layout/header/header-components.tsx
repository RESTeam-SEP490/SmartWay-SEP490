import React from 'react';

import { Typography } from 'antd';
import { Link } from 'react-router-dom';

type BrandType = 'primary' | 'white';

export const BrandIcon = ({ type = 'primary', isHiddenText = false, ...props }) => (
  <div {...props}>
    <div className="mx-3 flex items-center gap-2 ">
      <div className="translate-y-1">
        <img src={type === 'primary' ? 'content/images/SW_logo.svg' : 'content/images/SW_logo_white.svg'} alt="Logo" width={48} />
      </div>
      <Typography.Title level={3} className="!m-0 overflow-hidden transition-all duration-300 ease-in-collapse whitespace-nowrap">
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
