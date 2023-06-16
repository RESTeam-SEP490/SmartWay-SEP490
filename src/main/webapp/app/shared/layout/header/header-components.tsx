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
    <span>
      <span className="text-slate-400 font-bold text-xl">Smart</span>
      <span className="text-blue-500 font-bold text-xl">Way</span>
    </span>
  </Link>
);

export const Home = () => (
  <NavItem>
    <Link to="/" className="d-flex align-items-center">
      <FontAwesomeIcon icon="home" />
      <span>
        <Translate contentKey="global.menu.home">Home</Translate>
      </span>
    </Link>
  </NavItem>
);
