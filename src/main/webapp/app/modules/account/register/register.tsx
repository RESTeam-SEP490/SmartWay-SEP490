import React, { useState, useEffect } from 'react';
import { Translate, translate, ValidatedField, ValidatedForm, isEmail } from 'react-jhipster';
import { Row, Col, Alert, Button } from 'reactstrap';
import { toast } from 'react-toastify';

import PasswordStrengthBar from 'app/shared/layout/password/password-strength-bar';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { handleRegister, reset } from './register.reducer';
import { Form } from 'antd';
import Input from 'antd/es/input/Input';
import FormItem from 'antd/es/form/FormItem';
import { values } from 'lodash';

export const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const handleValidSubmit = ({ username, email, firstPassword }) => {
    dispatch(handleRegister({ login: username, email, password: firstPassword, langKey: currentLocale }));
  };

  const updatePassword = event => setPassword(event.target.value);

  const successMessage = useAppSelector(state => state.register.successMessage);

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage));
    }
  }, [successMessage]);

  return (
    <div>
      <div className="flex">
        <div className="w-4/12 p-4 h-screen">
          <div className="w-full h-full bg-blue-600 rounded-md"></div>
        </div>
        <div className="w-6/12 p-4">
          <h1 className="h1" data-cy="registerTitle">
            <Translate contentKey="register.title">Create your account</Translate>
          </h1>
          <Form layout="vertical" size="large" name="register" onFinish={handleValidSubmit} scrollToFirstError>
            <Form.Item
              name="fullName"
              label={translate('global.form.fullName.label')}
              rules={[
                { required: true, message: translate('global.messages.validate.fullName.required') },
                { pattern: /^[a-z | \P{XDigit}]+$/, message: translate('global.messages.validate.fullName.required') },
                { len: 1, message: translate('global.messages.validate.fullName.required') },
                { max: 50, message: translate('global.messages.validate.fullName.required') },
              ]}
              data-cy="username"
            >
              <Input placeholder={translate('global.form.username.placeholder')} />
            </Form.Item>
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
              data-cy="email"
            >
              <Input placeholder={translate('global.form.email.placeholder')} />
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 10 }}
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
              data-cy="username"
            >
              <Input placeholder={translate('global.form.username.placeholder')} />
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 10 }}
              name="firstPassword"
              label={translate('global.form.newpassword.label')}
              rules={[
                { required: true, message: translate('global.messages.validate.newpassword.required') },
                { min: 4, message: translate('global.messages.validate.newpassword.minlength') },
                { max: 50, message: translate('global.messages.validate.newpassword.maxlength') },
              ]}
              data-cy="firstPassword"
            >
              <Input onChange={updatePassword} placeholder={translate('global.form.newpassword.placeholder')} />
            </Form.Item>
            <PasswordStrengthBar password={password} />
            <Form.Item
              name="secondPassword"
              label={translate('global.form.confirmpassword.label')}
              rules={[
                { required: true, message: translate('global.messages.validate.confirmpassword.required') },
                { min: 4, message: translate('global.messages.validate.confirmpassword.minlength') },
                { max: 50, message: translate('global.messages.validate.confirmpassword.maxlength') },
                { validator: (_, value) => (value === password ? Promise.resolve() : Promise.reject()) },
              ]}
              data-cy="secondPassword"
            >
              <Input placeholder={translate('global.form.newpassword.placeholder')} />
            </Form.Item>
            <Button id="register-submit" color="primary" type="submit" data-cy="submit">
              <Translate contentKey="register.form.button">Register</Translate>
            </Button>
          </Form>
          <p>&nbsp;</p>
          <Alert color="warning">
            <span>
              <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
            </span>
            <a className="alert-link">
              <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
            </a>
            <span>
              <Translate contentKey="global.messages.info.authenticated.suffix">
                , you can try the default accounts:
                <br />- Administrator (login=&quot;admin&quot; and password=&quot;admin&quot;)
                <br />- User (login=&quot;user&quot; and password=&quot;user&quot;).
              </Translate>
            </span>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
