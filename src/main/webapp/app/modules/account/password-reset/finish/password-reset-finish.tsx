import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { Navigate, useSearchParams } from 'react-router-dom';

import { handlePasswordResetFinish, reset } from '../password-reset.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Button, Card, Form, Image, Input, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';

const PasswordResetFinishPage = () => {
  const dispatch = useAppDispatch();

  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

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
      <div className="flex justify-center align-middle">
        <Card className="w-2/5 mt-20">
          <Form name="reset-password" scrollToFirstError className="!mt-10" onFinish={handleValidSubmit}>
            <div className="flex justify-center my-4">
              <Image
                src="https://res.cloudinary.com/fptcomplex/image/upload/v1691812110/5172967_data_hosting_internet_lock_security_icon_c7djmi.png"
                width="20%"
                preview={false}
              ></Image>
            </div>
            <p className="text-lg flex justify-center">
              <Translate contentKey="reset.request.title"></Translate>
            </p>
            <div className="mx-20 ">
              <Form.Item
                label={translate('global.form.newpassword.label')}
                name={'newPassword'}
                rules={[
                  { required: true, message: translate('global.messages.validate.newpassword.required') },
                  { min: 4, message: translate('global.messages.validate.newpassword.minlength') },
                  { max: 50, message: translate('global.messages.validate.newpassword.maxlength') },
                ]}
              >
                <Input type="password" prefix={<LockOutlined rev={undefined} />} onChange={updateNewPassword} />
              </Form.Item>

              <Form.Item
                label={translate('global.form.confirmnewpassword.label')}
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
                <Input type="password" prefix={<LockOutlined rev={undefined} />} onChange={updateConfirmPassword} />
              </Form.Item>

              <div className="flex justify-center">
                <Button type="primary" htmlType="submit" className="mx-2">
                  <Translate contentKey={'reset.request.form.button'}></Translate>
                </Button>
              </div>
            </div>
          </Form>
        </Card>
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
