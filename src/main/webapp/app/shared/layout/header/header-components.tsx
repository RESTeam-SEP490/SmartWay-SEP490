import React from 'react';
import { Translate } from 'react-jhipster';

import { NavItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/SW_logo.svg" alt="Logo" width={55} />
  </div>
);

export const Brand = () => (
  <Link to="/" className="flex justify-center items-center gap-2 cursor-pointer no-underline">
    <BrandIcon />
    <span className="-translate-y-1">
      <span className="text-slate-400 font-semibold text-2xl">Smart</span>
      <span className="text-blue-600 font-semibold text-2xl">Way</span>
    </span>
  </Link>
);
