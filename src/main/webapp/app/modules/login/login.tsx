import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Typography } from 'antd';
import Password from 'antd/es/input/Password';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { LocaleMenu } from 'app/shared/layout/menus';
import { login } from 'app/shared/reducers/authentication';
import { Translate, translate } from 'react-jhipster';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { getAppUrl } from 'app/shared/util/subdomain/helpers';
import NavigateAfterLogin from './navigate-after-login';

export const Login = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);
  const loading = useAppSelector(state => state.authentication.loading);

  const domain = useAppSelector(state => state.applicationProfile.domain);
  const isInProd = useAppSelector(state => state.applicationProfile.inProduction);

  const handleLogin = ({ username, password, rememberMe }) => {
    dispatch(login(username, password, rememberMe));
  };

  if (isAuthenticated) {
    return <NavigateAfterLogin />;
  }

  return (
    <div>
      <div className="flex">
        <div className="flex flex-col items-center w-full p-4 lg:w-6/12 xl:w-5/12 ">
          <div className="flex items-center justify-between w-full px-8 py-6 ">
            <div className="inline-block cursor-pointer" onClick={() => window.location.replace(getAppUrl(isInProd, 'www', domain, ''))}>
              <BrandIcon />
            </div>
            <LocaleMenu />
          </div>
          <div className="flex flex-col justify-center -translate-y-8 lg:w-80 grow">
            <Typography.Title className="!mb-1" level={2}>
              <Translate contentKey="login.title">Welcome back</Translate>
            </Typography.Title>
            <Typography.Text className="text-gray-500 ">
              <Translate contentKey="login.subtitle">Enter your credentials to access your Account</Translate>
            </Typography.Text>
            <Form size="large" name="login" onFinish={handleLogin} scrollToFirstError className="!mt-10">
              {loginError ? (
                <Alert className="mb-4" showIcon type="error" message={translate('login.messages.error.authentication')} />
              ) : null}
              <Form.Item name="username" rules={[{ required: true, message: 'Username cannot be empty!' }]}>
                <Input
                  prefix={<UserOutlined rev={UserOutlined} className="text-gray-400" />}
                  placeholder={translate('global.form.username.placeholder')}
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'Password cannot be empty!' }, {}]}>
                <Password
                  prefix={<LockOutlined rev={LockOutlined} className="text-gray-400" />}
                  placeholder={translate('login.form.password.placeholder')}
                />
              </Form.Item>
              <Form.Item name="rememberMe" className="float-left" valuePropName="checked" initialValue={true}>
                <Checkbox className="!font-normal ">
                  <Translate contentKey="login.form.rememberme" />
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Link to="/account/reset/request" className="float-right hover:underline">
                  <Translate contentKey="login.password.forgot">Forget your password?</Translate>
                </Link>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary" block loading={loading}>
                  <Translate contentKey="login.form.button">Sign in</Translate>
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="hidden h-screen p-6 md:block md:w-6/12 xl:w-7/12">
          <div className="relative w-full h-full">
            <div className="absolute top-0 bottom-0 w-full rounded-lg bg-bottom lg:bg-right-bottom bg-cover bg-wall-primary bg-[url('content/images/wall-2.jpeg')]"></div>
            <div className="absolute top-0 bottom-0 w-full rounded-lg bg-gradient-to-l from-12 to-90 from-blue-600/60 to-blue-200/60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
