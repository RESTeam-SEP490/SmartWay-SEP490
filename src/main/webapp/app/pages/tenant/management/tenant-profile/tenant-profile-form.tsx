import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { translate } from 'react-jhipster';
import { Button, DatePicker, Form, Input, message, Modal, Select, Tabs } from 'antd';
import { validateEmail, validatePhone } from 'app/pages/tenant/management/staff/staff.reducer';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getTenant, updateTenant } from 'app/pages/tenant/management/tenant-profile/tenant-profile.reducer';
import { ITenant } from 'app/shared/model/tenant';
import dayjs from 'dayjs';
import { Moment } from 'moment';
import { changePassword } from 'app/pages/tenant/management/tenant-profile/tenant-change-password.reducer';

export const TenantProfileForm = () => {
  const [form] = Form.useForm();
  const [formChangePassword] = Form.useForm();
  const dispatch = useAppDispatch();
  const [tenantData, setTenantData] = useState<ITenant | null>(null);
  const tenant = useAppSelector(state => state.tenant.entity);
  const [isTenantLoaded, setIsTenantLoaded] = useState(false);
  const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [isPasswordSaved, setIsPasswordSaved] = useState(false);

  useEffect(() => {
    dispatch(getTenant());
    console.log(dispatch(getTenant()));
  }, []);

  useEffect(() => {
    if (tenant) {
      setTenantData(tenant);
      setIsTenantLoaded(true);
    }
  }, [tenant]);

  useEffect(() => {
    if (isTenantLoaded) {
      form.setFieldsValue({ ...tenantData, birthday: formatDateForDatePicker() });
    }
  }, [isTenantLoaded, tenantData]);

  const showChangePasswordModal = () => {
    setChangePasswordModalVisible(true);
  };

  const hideChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
  };

  const validateRetypePassword = (_: any, value: string) => {
    const newPassword = form.getFieldValue('resetPassword');

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
    newData.birthday = formatDateForBackend(newData.birthday);
    console.log(newData);
    dispatch(updateTenant(newData));
  };

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];

  const formatDateForDatePicker = () => {
    if (tenantData && tenantData.birthday) {
      // Sử dụng format() để định dạng lại ngày theo định dạng 'YYYY-MM-DD'
      return dayjs(tenant.birthday);
    }
    return null;
  };

  // Convert Moment object back to string for backend
  const formatDateForBackend = (dateFromDatePicker: Moment | null) => {
    if (!dateFromDatePicker) return null;
    return dateFromDatePicker.toDate();
  };

  function handlePasswordChange() {
    const newDataPassword = formChangePassword.getFieldsValue();
    dispatch(changePassword(newDataPassword))
      .then(response => {
        if (response.payload) {
          message.success('Save password successfully');

          formChangePassword.resetFields();

          hideChangePasswordModal();

          setIsPasswordSaved(true);
        }
      })
      .catch(() => {
        // Xử lý lỗi nếu cần
      });
  }

  return (
    <>
      <Modal
        title={translate('users.infoTabs.changePassword')}
        visible={isChangePasswordModalVisible}
        onCancel={hideChangePasswordModal}
        footer={null}
      >
        <Form form={formChangePassword} onFinish={handlePasswordChange}>
          <Form.Item
            label={translate('users.currentPassword.label')}
            name={'currentPassword'}
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={translate('users.newPassword.label')}
            name={'newPassword'}
            rules={[{ required: true, message: 'Please enter your new password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={translate('users.confirmPassword.label')}
            name={'confirmPassword'}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The new password do not match');
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {translate('users.savePassword')}
          </Button>
        </Form>
      </Modal>

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
                    { required: true, message: translate('entity.validation.required') },
                    { max: 50, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={translate('users.birthday.label')}
                  name={'birthday'}
                  rules={[{ required: true, message: translate('entity.validation.required') }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label={translate('users.gender.label')}
                  name={'gender'}
                  rules={[{ required: true, message: translate('entity.validation.required') }]}
                >
                  <Select options={genderOptions} />
                </Form.Item>
                <Button onClick={showChangePasswordModal}>{translate('users.infoTabs.changePassword')}</Button>
              </div>
            </Tabs.TabPane>
          </Tabs>
          <Button type="primary" onClick={handleSaveProfile} className="float-right">
            {translate('users.save')}
          </Button>
        </Form>
      </div>
    </>
  );
};
