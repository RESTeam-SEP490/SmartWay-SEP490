import React, { useEffect, useState } from 'react';
import { Translate, isEmail, translate } from 'react-jhipster';
import { toast } from 'react-toastify';

import { Button, Form, Select, Typography } from 'antd';
import { Col, Row } from 'antd/es/grid';
import Input from 'antd/es/input/Input';
import Password from 'antd/es/input/Password';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { handleRegister, reset } from './register.reducer';
import restaurant from 'app/entities/restaurant/restaurant.reducer';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brand } from 'app/shared/layout/header/header-components';
import { LocaleMenu } from 'app/shared/layout/menus';

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { Option } = Select;

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const handleValidSubmit = ({ fullName, phone, email, restaurantId, username, firstPassword }) => {
    dispatch(handleRegister({ fullName, phone, email, restaurantId, username, password: firstPassword, langKey: currentLocale }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
      navigate('/login');
    }
  }, [successMessage]);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select className="w-fit" defaultValue="86">
        <Option value="86">+84</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <div className="flex">
        <div className="w-5/12 p-4 min-h-max">
          <div className="w-full h-full bg-blue-500 rounded-md"></div>
        </div>
        <div className="w-7/12 p-4 flex flex-col items-center">
          <div className=" flex w-full justify-between py-6 px-8">
            <Brand />
            <LocaleMenu currentLocale={currentLocale} />
          </div>
          <div className="lg:max-w-lg">
            <Typography.Title className="!mb-0">
              <Translate contentKey="register.title">Create your account</Translate>
            </Typography.Title>
            <Typography.Text className="text-gray-500">
              <Translate contentKey="register.subtitle">Enter your credentials to access your Account</Translate>
            </Typography.Text>
            <Form layout="vertical" name="register" onFinish={handleValidSubmit} scrollToFirstError className="!mt-10">
              <Form.Item
                name="fullName"
                label={translate('global.form.fullName.label')}
                rules={[
                  { required: true, message: translate('global.messages.validate.fullName.required') },
                  { pattern: /^[\p{L}\D]+$/gu, message: translate('global.messages.validate.fullName.pattern') },
                  { min: 1, message: translate('global.messages.validate.fullName.min') },
                  { max: 50, message: translate('global.messages.validate.fullName.max') },
                ]}
              >
                <Input placeholder={translate('global.form.fullName.placeholder')} />
              </Form.Item>
              <Row>
                <Col span={12} className="pr-2">
                  <Form.Item
                    name="phone"
                    label={translate('global.form.phone.label')}
                    rules={[
                      { required: true, message: translate('global.messages.validate.phone.required') },
                      { min: 5, message: translate('global.messages.validate.phone.minlength') },
                      { max: 50, message: translate('global.messages.validate.phone.maxlength') },
                    ]}
                  >
                    <Input addonBefore={prefixSelector} placeholder={translate('global.form.phone.placeholder')} />
                  </Form.Item>
                </Col>
                <Col span={12} className="pl-2">
                  <Form.Item
                    name="email"
                    label={translate('global.form.email.label')}
                    rules={[
                      { type: 'email' },
                      { required: true, message: translate('global.messages.validate.email.required') },
                      { min: 5, message: translate('global.messages.validate.email.minlength') },
                      { max: 254, message: translate('global.messages.validate.email.maxlength') },
                      {
                        validator: (_, value: string) => (isEmail(value) ? Promise.resolve() : Promise.reject()),
                        message: translate('global.messages.validate.email.invalid'),
                      },
                    ]}
                  >
                    <Input placeholder={translate('global.form.email.placeholder')} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="restaurantId"
                label={translate('global.form.restaurantName.label')}
                rules={[
                  { required: true, message: translate('global.messages.validate.restaurantName.required') },
                  { pattern: /^[a-z0-9]+$/, message: translate('global.messages.validate.restaurantName.pattern') },
                  { min: 1, message: translate('global.messages.validate.restaurantName.min') },
                  { max: 50, message: translate('global.messages.validate.restaurantName.max') },
                ]}
              >
                <Input placeholder={translate('global.form.restaurantName.placeholder')} />
              </Form.Item>
              <Row>
                <Col span={12} className="pr-2">
                  <Form.Item
                    name="username"
                    label={translate('global.form.username.label')}
                    rules={[
                      { required: true, message: translate('register.messages.validate.login.required') },
                      {
                        pattern: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                        message: translate('register.messages.validate.login.pattern'),
                      },
                      { min: 1, message: translate('register.messages.validate.login.minlength') },
                      { max: 50, message: translate('register.messages.validate.login.maxlength') },
                    ]}
                  >
                    <Input placeholder={translate('global.form.username.placeholder')} />
                  </Form.Item>
                </Col>
                <Col span={12} className="pl-2">
                  <Form.Item
                    name="firstPassword"
                    label={translate('global.form.password.label')}
                    rules={[
                      { required: true, message: translate('global.messages.validate.newpassword.required') },
                      { min: 4, message: translate('global.messages.validate.newpassword.minlength') },
                      { max: 50, message: translate('global.messages.validate.newpassword.maxlength') },
                    ]}
                  >
                    <Password onChange={updatePassword} placeholder={translate('global.form.password.placeholder')} className="mb-2" />
                  </Form.Item>
                  <PasswordStrengthBar password={password} />
                </Col>
              </Row>

              <Form.Item
                name="secondPassword"
                label={translate('global.form.confirmpassword.label')}
                rules={[
                  { required: true, message: translate('global.messages.validate.confirmpassword.required') },
                  { min: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                  { max: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                  { validator: (_, value) => (value === password ? Promise.resolve() : Promise.reject()) },
                ]}
              >
                <Password placeholder={translate('global.form.confirmpassword.placeholder')} />
              </Form.Item>
              <Button htmlType="submit" block type="primary" size="large">
                <Translate contentKey="register.form.button">Register</Translate>
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
