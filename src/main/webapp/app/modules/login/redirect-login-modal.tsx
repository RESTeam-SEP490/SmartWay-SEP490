import { Button, Form, Input, Modal } from 'antd';
import { DOMAIN_DEV, DOMAIN_PROD, toNonAccentVietnamese } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { Link } from 'react-router-dom';

export const RedirectLoginModal = ({ isOpen, handleClose }) => {
  const dispatch = useAppDispatch();

  const isInProduction = useAppSelector(state => state.applicationProfile.inProduction);
  const domain = useAppSelector(state => state.applicationProfile.domain);

  const [form] = Form.useForm();

  const handleSubmit = ({ subdomain }) => {
    window.location.replace(`https://${subdomain}.${domain}`);
  };
  return (
    <Modal open={isOpen} title={translate('login.form.button')} destroyOnClose onCancel={handleClose} centered footer={[]}>
      <Form form={form} onFinish={handleSubmit} className="mt-8">
        <Form.Item name="subdomain" className="!mb-2">
          <Input
            autoComplete="off"
            size="large"
            addonAfter={'.' + (isInProduction ? DOMAIN_PROD : DOMAIN_DEV)}
            placeholder={translate('login.form.modal.placeholder')}
            onBlur={e => {
              form.setFieldValue(
                'subdomain',
                toNonAccentVietnamese(e.target.value)
                  .toLowerCase()
                  .replace(/[^a-z0-9]/gi, '')
              );
              if (form.isFieldTouched('subdomain')) form.validateFields(['subdomain']);
            }}
          />
        </Form.Item>
        <div className="mb-2">
          <span>
            <Translate contentKey="login.link.noAccount">You don&apos;t have an restaurant yet?</Translate>
          </span>{' '}
          <Link to="/register" className="font-semibold hover:underline">
            <Translate contentKey="login.link.getStarted">Get started now</Translate>
          </Link>
        </div>
        <div className="flex justify-end">
          <Button type="primary" size="large" htmlType="submit">
            <Translate contentKey="register.messages.success.button">Truy cập</Translate>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
