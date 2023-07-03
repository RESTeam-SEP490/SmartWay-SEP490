import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';

import { LockOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Typography } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import Password from 'antd/es/input/Password';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Brand } from 'app/shared/layout/header/header-components';
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

  const handleLogin = ({ restaurantId, username, password, rememberMe }) => {
    dispatch(login(restaurantId, username, password, rememberMe));
  };

  const { from } = (location.state as any) || { from: { pathname: '/menu-items', search: location.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return (
    <div>
      <div className="flex">
        <div className="flex flex-col items-center w-7/12 p-4 ">
          <div className="flex justify-between w-full px-8 py-6 ">
            <Brand />
            <LocaleMenu currentLocale={currentLocale} />
          </div>
          <div className="lg:w-80 ">
            <Typography.Title className="!mb-1">
              <Translate contentKey="login.title">Welcome back</Translate>
            </Typography.Title>
            <Typography.Text className="text-gray-500 ">
              <Translate contentKey="login.subtitle">Enter your credentials to access your Account</Translate>
            </Typography.Text>
            <Form layout="vertical" size="large" name="login" onFinish={handleLogin} scrollToFirstError className="!mt-12">
              {loginError ? (
                <Alert className="mb-4" showIcon type="error" message={translate('login.messages.error.authentication')} />
              ) : null}
              <Form.Item
                name="restaurantId"
                rules={[
                  { required: true, message: translate('global.messages.validate.restaurantName.required') },
                  { pattern: /^[a-z0-9]+$/, message: translate('global.messages.validate.restaurantName.pattern') },
                  { max: 30, message: translate('global.messages.validate.restaurantName.max') },
                ]}
              >
                <Input
                  prefix={<ShopOutlined rev={ShopOutlined} className="text-gray-400" />}
                  placeholder={translate('global.form.restaurantName.placeholder')}
                />
              </Form.Item>
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
              <FormItem>
                <span>
                  <Translate contentKey="login.link.noAccount">You don&apos;t have an restaurant yet?</Translate>
                </span>{' '}
                <Link to="/account/register" className="font-semibold hover:underline">
                  <Translate contentKey="login.link.getStarted">Get started now</Translate>
                </Link>
              </FormItem>
            </Form>
          </div>
        </div>
        <div className="w-5/12 h-screen p-4">
          <div className="w-full min-h-full bg-blue-600 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
