import React, { useLayoutEffect } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { useNavigate } from 'react-router-dom';
import { Storage } from 'react-jhipster';

export const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    dispatch(logout());
    navigate('/');
    Storage.session.set('isCollapsed', false);
  });

  return <></>;
};

export default Logout;
