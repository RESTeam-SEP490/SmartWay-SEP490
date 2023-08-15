import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { CheckCircleTwoTone, MailOutlined } from '@ant-design/icons';
import { getAppUrl } from 'app/shared/util/subdomain/helpers';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { LocaleMenu } from 'app/shared/layout/menus';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();
  const successMessage = useAppSelector(state => state.passwordReset.successMessage);
  const domain = useAppSelector(state => state.applicationProfile.domain);
  const isInProd = useAppSelector(state => state.applicationProfile.inProduction);

  useEffect(
    () => () => {
      dispatch(reset());
    },
    []
  );

  const handleValidSubmit = ({ email }) => {
    dispatch(handlePasswordResetInit(email));
  };

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
            {!successMessage ? (
              <>
                <Typography.Title className="!mb-1" level={2}>
                  <Translate contentKey="reset.request.forgot">Forgot Password</Translate>
                </Typography.Title>
                <Typography.Text className="text-gray-500 ">
                  <Translate contentKey="reset.request.messages.info">Enter the email address you used to register</Translate>
                </Typography.Text>
                <Form size="large" name="reset-password" scrollToFirstError className="!mt-5" onFinish={handleValidSubmit}>
                  <Form.Item
                    name={'email'}
                    rules={[
                      { required: true, message: translate('global.messages.validate.email.required') },
                      { min: 5, message: translate('global.messages.validate.email.minlength') },
                      { max: 254, message: translate('global.messages.validate.email.maxlength') },
                    ]}
                  >
                    <Input placeholder={translate('global.form.email.label')} prefix={<MailOutlined rev={undefined} />} />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      <Translate contentKey={'reset.buttonEmail'}></Translate>
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <>
                <Typography.Title className="!mb-1  " level={2}>
                  <CheckCircleTwoTone twoToneColor="#52c41a" rev={undefined} />{' '}
                  <Translate contentKey="reset.request.sendEmail">Send Email Successfully</Translate>
                </Typography.Title>
                <Alert message={translate(successMessage)} className="mt-2"></Alert>
              </>
            )}
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

export default PasswordResetInit;
