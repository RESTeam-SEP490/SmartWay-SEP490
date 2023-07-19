import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { translate } from 'react-jhipster';
import { Button, DatePicker, Form, Input, Tabs } from 'antd';
import { validateEmail, validatePhone } from 'app/pages/tenant/management/staff/staff.reducer';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getTenant, updateTenant } from 'app/pages/tenant/management/tenant-profile/tenant-profile.reducer';
import { ITenant } from 'app/shared/model/tenant';

export const TenantProfileForm = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [tenantData, setTenantData] = useState<ITenant | null>(null);
  const tenant = useAppSelector(state => state.tenant.entity);

  useEffect(() => {
    dispatch(getTenant());
  }, []);

  useEffect(() => {
    form.setFieldsValue({ ...tenant });
    setTenantData({ ...tenant });
  }, [tenant]);

  const validateRetypePassword = (_: any, value: string) => {
    const newPassword = form.getFieldValue('resetPassword'); // Lấy giá trị của trường 'resetPassword'

    if (!newPassword) {
      return Promise.reject(new Error('Please enter New Password first'));
    }

    if (value !== newPassword) {
      return Promise.reject(new Error('New Password and Retype Password do not match'));
    }

    return Promise.resolve();
  };

  const handleSaveProfile = () => {
    const newData = form.getFieldsValue();
    if (tenantData?.id) {
      newData.id = tenantData.id;
    }
    dispatch(updateTenant(newData));
  };

  return (
    <>
      <div className="form-wrapper flex justify-center h-screen">
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} className="flex-auto">
          <Tabs className="p-2">
            <Tabs.TabPane tab={translate('users.infoTabs.information')} key={1} className="flex gap-8 p-2">
              <div className="flex-grow">
                <Form.Item
                  label={translate('users.username.label')}
                  name={'username'}
                  rules={[
                    { required: true, message: translate('entity.validation.required') },
                    { max: 50, message: translate('entity.validation.max', { max: 50 }) },
                    { min: 4, message: translate('entity.validation.min', { min: 4 }) },
                  ]}
                >
                  <Input />
                  {/*<Input value={tenantData?.username} onChange={e => setTenantData({ ...tenantData, username: e.target.value })} /> {}*/}
                </Form.Item>
                <Form.Item
                  label={translate('users.fullName.label')}
                  name={'fullName'}
                  rules={[
                    { required: true, message: translate('entity.validation.required') },
                    { max: 100, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={translate('staff.phone.label')}
                  name={'phone'}
                  rules={[
                    { validator: validatePhone },
                    { required: true, message: translate('entity.validation.required') },
                    { max: 20, message: translate('entity.validation.max', { max: 20 }) },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={translate('staff.email.label')}
                  name={'email'}
                  rules={[
                    { validator: validateEmail },
                    { required: true, message: translate('entity.validation.required') },
                    { max: 50, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="flex-grow">
                <Form.Item
                  label={translate('users.address.label')}
                  name={'address'}
                  rules={[
                    { validator: validateEmail },
                    { required: true, message: translate('entity.validation.required') },
                    { max: 50, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={translate('users.birthday.label')}
                  name={'birthdate'}
                  rules={[{ required: true, message: translate('entity.validation.required') }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </Tabs.TabPane>
          </Tabs>
          <Tabs className="p-2">
            <Tabs.TabPane tab={translate('users.infoTabs.changePassword')} key={1} className="flex gap-8 p-2">
              <div className="flex-grow">
                <Form.Item
                  label={translate('users.currentPassword.label')}
                  name={'password'}
                  rules={[
                    { max: 50, message: translate('entity.validation.max', { max: 50 }) },
                    { min: 4, message: translate('entity.validation.min', { min: 4 }) },
                  ]}
                >
                  <Input.Password />
                  {}
                </Form.Item>
                <Form.Item
                  label={translate('users.newPassword.label')}
                  name={'resetPassword'}
                  rules={[
                    { max: 50, message: translate('entity.validation.max', { max: 50 }) },
                    { min: 4, message: translate('entity.validation.min', { min: 4 }) },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={translate('users.retypePassword.label')}
                  name={'retypePassword'}
                  dependencies={['resetPassword']}
                  rules={[{ message: translate('entity.validation.required') }, { validator: validateRetypePassword }]}
                >
                  <Input.Password />
                </Form.Item>
              </div>
              <div className="flex-grow"></div>
            </Tabs.TabPane>
          </Tabs>
          <Button type="primary" onClick={handleSaveProfile} className="float-right">
            Save
          </Button>
        </Form>
      </div>
    </>
  );
};
