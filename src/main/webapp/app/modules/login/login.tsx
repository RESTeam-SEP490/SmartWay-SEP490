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

export const Login = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const loginError = useAppSelector(state => state.authentication.loginError);
  const location = useLocation();
  const loading = useAppSelector(state => state.authentication.loading);

  const handleLogin = ({ username, password, rememberMe }) => {
    dispatch(login(username, password, rememberMe));
  };

  const { from } = (location.state as any) || { from: { pathname: '/menu-items', search: location.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return (
    <div>
      <div className="flex">
        <div className="flex flex-col items-center w-full lg:w-6/12 xl:w-5/12 p-4 ">
          <div className="flex items-center justify-between w-full px-8 py-6 ">
            <BrandIcon />
            <LocaleMenu currentLocale={currentLocale} />
          </div>
          <div className="flex flex-col justify-center -translate-y-8 lg:w-80 grow">
            <Typography.Title className="!mb-1" level={2}>
              <Translate contentKey="login.title">Welcome back</Translate>
            </Typography.Title>
            <Typography.Text className="text-gray-500 ">
              <Translate contentKey="login.subtitle">Enter your credentials to access your Account</Translate>
            </Typography.Text>
            <Form layout="vertical" size="large" name="login" onFinish={handleLogin} scrollToFirstError className="!mt-10">
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
              <Form.Item name="rememberMe" className="float-left" valuePropName="checked">
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
        <div className="hidden md:block md:w-6/12 xl:w-7/12 h-screen p-6">
          <div className="w-full h-full  relative">
            <div className="absolute top-0 bottom-0 w-full rounded-lg bg-bottom lg:bg-right-bottom bg-cover bg-wall-primary bg-[url('content/images/wall-2.jpg')]"></div>
            <div className="absolute top-0 bottom-0 w-full rounded-lg bg-gradient-to-l from-12 to-90  from-blue-600/60 to-blue-200/60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
