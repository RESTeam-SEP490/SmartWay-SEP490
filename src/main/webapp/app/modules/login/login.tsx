import React, { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import { Translate, ValidatedField, translate } from 'react-jhipster';
import { Button, Checkbox, Form, Input } from 'antd';
import { Alert, Col, Row } from 'reactstrap';
import { useForm } from 'react-hook-form';
import Password from 'antd/es/input/Password';

export const Login = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);
  const showModalLogin = useAppSelector(state => state.authentication.showModalLogin);
  const [showModal, setShowModal] = useState(showModalLogin);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleLogin = ({ restaurantName, username, password, rememberMe }) =>
    dispatch(login(restaurantName, username, password, rememberMe));

  const { from } = (location.state as any) || { from: { pathname: '/', search: location.search } };
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return (
    <div>
      <div className="flex">
        <div className="w-8/12 p-4">
          <div className="mx-auto max-w-2xl">
            <Form layout="vertical" size="large" name="login" onFinish={handleLogin}>
              <h2 className="h2">
                <Translate contentKey="login.title">Sign in</Translate>
              </h2>
              <Row>
                <Col md="12">
                  {loginError ? (
                    <Alert color="danger" data-cy="loginError">
                      <Translate contentKey="login.messages.error.authentication">
                        <strong>Failed to sign in!</strong> Please check your credentials and try again.
                      </Translate>
                    </Alert>
                  ) : null}
                </Col>
                <Col md="12">
                  <Form.Item
                    name="restaurantName"
                    label={translate('global.form.restaurantName.label')}
                    data-cy="restaurantName"
                    rules={[{ required: true, message: 'Restaurant name cannot be empty!' }]}
                  >
                    <Input placeholder={translate('global.form.restaurantName.placeholder')} />
                  </Form.Item>
                  <Form.Item
                    name="username"
                    label={translate('global.form.username.label')}
                    data-cy="username"
                    rules={[{ required: true, message: 'Username cannot be empty!' }]}
                  >
                    <Input placeholder={translate('global.form.username.placeholder')} />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label={translate('login.form.password')}
                    required
                    data-cy="password"
                    rules={[{ required: true, message: 'Password cannot be empty!' }]}
                  >
                    <Password placeholder={translate('login.form.password.placeholder')} />
                  </Form.Item>
                  <Form.Item>
                    <Form.Item name="rememberMe" data-cy="rememberme" className="float-left">
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Form.Item>
                      <Link to="/account/reset/request" className="float-right">
                        <Translate contentKey="login.password.forgot">Forget your password?</Translate>
                      </Link>
                    </Form.Item>
                  </Form.Item>
                </Col>
              </Row>
              <Alert color="warning">
                <span>
                  <Translate contentKey="global.messages.info.register.noaccount">You don&apos;t have an account yet?</Translate>
                </span>{' '}
                <Link to="/account/register">
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </Link>
              </Alert>
              <Button htmlType="submit" type="primary" className="login-form-button">
                <Translate contentKey="login.form.button">Sign in</Translate>
              </Button>
            </Form>
          </div>
        </div>
        <div className="w-6/12 p-4 h-screen">
          <div className="w-full h-full bg-blue-600 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
