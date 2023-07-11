import React, { useLayoutEffect } from 'react';

import { useAppDispatch } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { useNavigate } from 'react-router-dom';
import { Storage } from 'react-jhipster';

export const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    Storage.session.set('isCollapsed', false);
    dispatch(logout());
    navigate('/');
  });

  return <></>;
};

export default Logout;
