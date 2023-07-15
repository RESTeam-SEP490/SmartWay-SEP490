import React, { useEffect, useState } from 'react';
import { Translate, isEmail, translate } from 'react-jhipster';

import { CheckCircleFilled } from '@ant-design/icons';
import { Alert, Button, Form, Result, Select, Space, Typography } from 'antd';
import { Col, Row } from 'antd/es/grid';
import Input from 'antd/es/input/Input';
import Password from 'antd/es/input/Password';
import { toNonAccentVietnamese } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Brand } from 'app/shared/layout/header/header-components';
import { LocaleMenu } from 'app/shared/layout/menus';
import CountryList from 'country-list-with-dial-code-and-flag';
import CountryFlagSvg from 'country-list-with-dial-code-and-flag/dist/flag-svg';
import { Link, useNavigate } from 'react-router-dom';
import { handleRegister, reset } from './register.reducer';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [countryList, setCountryList] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(reset());
    setCountryList([...CountryList.getAll()]);
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const successLink = useAppSelector(state => state.register.restaurantLink);
  const domain = useAppSelector(state => state.applicationProfile.domain);

  const handleSubmit = ({ fullName, phone, dialCode, email, restaurantId, username, password }) => {
    dispatch(
      handleRegister({
        fullName,
        phone: dialCode + phone.replace(/^0+/, ''),
        email,
        restaurantId,
        username,
        password,
        langKey: currentLocale,
      })
    );
  };

  return (
    <div>
      <div className="flex">
        <div className="hidden min-h-screen p-4 lg:block lg:w-3/12 xl:w-5/12">
          <div className="w-full h-full bg-blue-600 rounded-md"></div>
        </div>
        <div className="flex flex-col items-center w-full min-h-screen p-4 lg:w-9/12 xl:w-7/12">
          <div className="flex items-center justify-between w-full px-8 py-6 ">
            <Brand />
            <LocaleMenu currentLocale={currentLocale} />
          </div>
          {successLink ? (
            <div className="flex items-center justify-center grow">
              <Result
                className="w-88"
                icon={<CheckCircleFilled className="!text-blue-600" rev={''} />}
                title={translate('register.messages.success')}
                extra={
                  <>
                    <Alert
                      type="info"
                      message={
                        <div className="flex flex-col items-center gap-2 px-10 py-4">
                          <span>
                            <Translate contentKey="register.messages.success.subtitle" />
                          </span>
                          <Button
                            type="link"
                            className="font-semibold hover:underline !py-0"
                            onClick={() => window.location.replace(successLink + '.' + domain)}
                          >
                            {successLink + '.' + domain}
                          </Button>
                        </div>
                      }
                    />
                    <Button
                      onClick={() => window.location.replace(successLink + '.' + domain)}
                      type="primary"
                      className="!w-40 mt-4"
                      size="large"
                    >
                      <Translate contentKey="register.messages.success.button" />
                    </Button>
                  </>
                }
              ></Result>
            </div>
          ) : (
            <div className="w-3/4">
              <Typography.Title className="!mb-1 text-blue" level={2}>
                <Translate contentKey="register.title">Create your account</Translate>
              </Typography.Title>
              <Typography.Text className="text-gray-500">
                <Translate contentKey="register.subtitle">Enter your credentials to access your Account</Translate>
              </Typography.Text>
              <Form
                form={form}
                requiredMark={false}
                size="large"
                layout="vertical"
                name="register"
                onFinish={handleSubmit}
                scrollToFirstError
                className="!mt-8 w-full"
              >
                <Form.Item
                  name="fullName"
                  validateFirst
                  label={translate('global.form.fullName.label')}
                  rules={[
                    { required: true, message: translate('global.messages.validate.fullName.required') },
                    { pattern: /^[\p{L}\D]+$/gu, message: translate('global.messages.validate.fullName.pattern') },
                    { max: 50, message: translate('global.messages.validate.fullName.max') },
                  ]}
                >
                  <Input placeholder={translate('global.form.fullName.placeholder')} />
                </Form.Item>
                <Row>
                  <Col span={14} className="pr-2">
                    <Form.Item label={translate('global.form.phone.label')} className="mb-0">
                      <Space.Compact className="w-full">
                        <Form.Item name="dialCode" className="!w-28" initialValue={'+84'}>
                          <Select
                            className="w-fit"
                            optionLabelProp="label"
                            defaultValue="+84"
                            popupMatchSelectWidth={false}
                            showSearch
                            popupClassName="!w-88"
                          >
                            {countryList.map(c => (
                              <Select.Option
                                key={c.dialCode + ' ' + c.name}
                                value={c.dialCode}
                                label={
                                  <>
                                    <img
                                      width={20}
                                      className="mb-1 mr-2"
                                      src={`data:image/svg+xml;utf8,${encodeURIComponent(CountryFlagSvg[c.code])}`}
                                    />
                                    {c.dialCode}
                                  </>
                                }
                              >
                                <img
                                  width={20}
                                  className="mb-1 mr-2"
                                  src={`data:image/svg+xml;utf8,${encodeURIComponent(CountryFlagSvg[c.code])}`}
                                />
                                {c.name}
                                <span className="ml-2 text-gray-600">{'(' + c.dialCode + ')'}</span>
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name="phone"
                          className="grow"
                          validateFirst
                          rules={[
                            { required: true, message: translate('global.messages.validate.phone.required') },
                            { pattern: /^\d{8,10}$/, message: translate('global.messages.validate.phone.invalid') },
                          ]}
                        >
                          <Input placeholder={translate('global.form.phone.placeholder')} />
                        </Form.Item>
                      </Space.Compact>
                    </Form.Item>
                  </Col>
                  <Col span={10} className="pl-2">
                    <Form.Item
                      name="email"
                      validateFirst
                      label={translate('global.form.email.label')}
                      rules={[
                        { required: true, message: translate('global.messages.validate.email.required') },
                        { max: 255, message: translate('global.messages.validate.email.maxlength') },
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
                  tooltip={translate('global.messages.info.register.restaurantNameTooltip')}
                  validateTrigger={[]}
                  label={translate('global.form.restaurantName.label')}
                  rules={[
                    { required: true, message: translate('global.messages.validate.restaurantName.required') },
                    { max: 50, message: translate('global.messages.validate.restaurantName.max') },
                  ]}
                >
                  <Input
                    placeholder={translate('global.form.restaurantName.placeholder')}
                    addonAfter={'smart-way.website'}
                    onBlur={e => {
                      form.setFieldValue(
                        'restaurantId',
                        toNonAccentVietnamese(e.target.value)
                          .toLowerCase()
                          .replace(/[^a-z0-9]/gi, '')
                      );
                      if (form.isFieldTouched('restaurantId')) form.validateFields(['restaurantId']);
                    }}
                  />
                </Form.Item>
                <Row>
                  <Col span={12} className="pr-2">
                    <Form.Item
                      name="username"
                      validateFirst
                      label={translate('global.form.username.label')}
                      rules={[
                        { required: true, message: translate('register.messages.validate.login.required') },
                        { min: 4, message: translate('register.messages.validate.login.minlength') },
                        {
                          pattern: /^(?=[a-zA-Z0-9._]+$)(?!.*[_.]{2})[^_.].*[^_.]$/,
                          message: translate('register.messages.validate.login.pattern'),
                        },
                        { max: 20, message: translate('register.messages.validate.login.maxlength') },
                      ]}
                    >
                      <Input placeholder={translate('global.form.username.placeholder')} />
                    </Form.Item>
                  </Col>
                  <Col span={12} className="pl-2">
                    <Form.Item
                      name="password"
                      validateFirst
                      label={translate('global.form.password.label')}
                      rules={[
                        { required: true, message: translate('global.messages.validate.newpassword.required') },
                        { min: 4, message: translate('global.messages.validate.newpassword.minlength') },
                        { max: 50, message: translate('global.messages.validate.newpassword.maxlength') },
                      ]}
                    >
                      <Password placeholder={translate('global.form.password.placeholder')} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Typography.Text>
                      <Translate contentKey="register.messages.alreadyHasAccount" />
                    </Typography.Text>
                    <Link to="/login" className="font-semibold hover:underline">
                      <Translate contentKey="login.form.button">Login</Translate>
                    </Link>
                  </div>
                  <Button htmlType="submit" type="primary" size="large">
                    <Translate contentKey="register.form.button">Register</Translate>
                  </Button>
                </Row>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
