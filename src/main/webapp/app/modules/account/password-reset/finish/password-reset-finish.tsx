import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Alert, Button, Card, Checkbox, Form, Image, Input, notification, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { getAppUrl } from 'app/shared/util/subdomain/helpers';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { LocaleMenu } from 'app/shared/layout/menus';
import Password from 'antd/es/input/Password';

const PasswordResetFinishPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const domain = useAppSelector(state => state.applicationProfile.domain);
  const isInProd = useAppSelector(state => state.applicationProfile.inProduction);

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  const handleValidSubmit = () => {
    dispatch(handlePasswordResetFinish({ key, newPassword }));
  };

  const updateNewPassword = event => {
    const newPassword = event.target.value;
    setNewPassword(newPassword);

    setPasswordMatch(newPassword === confirmPassword || confirmPassword === '');
  };

  const updateConfirmPassword = event => {
    const confirmPassword = event.target.value;
    setConfirmPassword(confirmPassword);

    setPasswordMatch(newPassword === confirmPassword || newPassword === '');
  };

  const getResetForm = () => {
    return (
      <div>
        <div className="flex">
          <div className="flex flex-col items-center w-full p-4 lg:w-6/12 xl:w-5/12 ">
            <div className="flex items-center justify-between w-full px-8 py-6 ">
              <div className="inline-block" onClick={() => window.location.replace(getAppUrl(isInProd, 'www', domain, ''))}>
                <BrandIcon />
              </div>
              <LocaleMenu />
            </div>
            <div className="flex flex-col justify-center -translate-y-8 lg:w-80 grow">
              <Typography.Title className="!mb-1" level={2}>
                <Translate contentKey="reset.request.new">New Password</Translate>
              </Typography.Title>
              <Typography.Text className="text-gray-500 ">
                <Translate contentKey="reset.request.info">Enter your credentials to access your Account</Translate>
              </Typography.Text>
              <Form size="large" name="reset-password" scrollToFirstError className="!mt-10" onFinish={handleValidSubmit}>
                <Form.Item
                  name={'newPassword'}
                  rules={[
                    { required: true, message: translate('global.messages.validate.newpassword.required') },
                    { min: 4, message: translate('global.messages.validate.newpassword.minlength') },
                    { max: 50, message: translate('global.messages.validate.newpassword.maxlength') },
                  ]}
                >
                  <Password
                    placeholder={translate('global.form.newpassword.label')}
                    type="password"
                    prefix={<LockOutlined rev={undefined} />}
                    onChange={updateNewPassword}
                  />
                </Form.Item>

                <Form.Item
                  name={'confirmPassword'}
                  rules={[
                    { required: true, message: translate('global.messages.validate.confirmPassword.required') },
                    { min: 4, message: translate('global.messages.validate.confirmPassword.minlength') },
                    { max: 50, message: translate('global.messages.validate.confirmPassword.maxlength') },
                    {
                      validator: (_, value) => (value === newPassword ? Promise.resolve() : Promise.reject('')),
                      message: translate('global.messages.error.dontmatch'),
                    },
                  ]}
                  validateStatus={passwordMatch ? '' : 'error'}
                  help={!passwordMatch && translate('global.messages.error.dontmatch')}
                >
                  <Password
                    placeholder={translate('global.form.confirmnewpassword.label')}
                    type="password"
                    prefix={<LockOutlined rev={undefined} />}
                    onChange={updateConfirmPassword}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    <Translate contentKey={'reset.request.form.button'}></Translate>
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

  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

  useEffect(() => {
    if (successMessage) {
      notification.success({ message: translate(successMessage) });
    }
  }, [successMessage]);

  if (successMessage) return <Navigate to={'/login'} />;

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="4">
          <div>{key ? getResetForm() : null}</div>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordResetFinishPage;
