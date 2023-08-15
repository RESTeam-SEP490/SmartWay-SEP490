import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { handlePasswordResetInit, reset } from '../password-reset.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Button, Form, Image, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';

export const PasswordResetInit = () => {
  const dispatch = useAppDispatch();
  const successMessage = useAppSelector(state => state.passwordReset.successMessage);

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
    <div className="flex justify-center">
      {!successMessage ? (
        <Form name="reset-password" scrollToFirstError className="!mt-10" onFinish={handleValidSubmit}>
          <div className="flex justify-center my-4">
            <Image
              src="https://res.cloudinary.com/fptcomplex/image/upload/v1691731461/forgot_bg_x72iup.png"
              width="60%"
              preview={false}
            ></Image>
          </div>
          <p className="text-lg flex justify-center">
            <Translate contentKey="reset.request.forgot"></Translate>
          </p>
          <Form.Item
            label={translate('global.form.email.label')}
            name={'email'}
            rules={[
              { required: true, message: translate('global.messages.validate.email.required') },
              { min: 5, message: translate('global.messages.validate.email.minlength') },
              { max: 254, message: translate('global.messages.validate.email.maxlength') },
            ]}
          >
            <div className="flex justify-center">
              <Input prefix={<MailOutlined rev={undefined} />} />
              <Button type="primary" htmlType="submit" className="mx-2">
                Send Email
              </Button>
            </div>
          </Form.Item>
        </Form>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="mt-20 flex justify-center">
              <Image
                src="https://res.cloudinary.com/fptcomplex/image/upload/v1692081683/043_success-mail_zavh6l.gif"
                preview={false}
                width="50%"
              ></Image>
            </div>
            <div>
              <p className="mt-5 text-lowercase font-medium text-lg flex justify-center">
                <Translate contentKey={successMessage}></Translate>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordResetInit;
