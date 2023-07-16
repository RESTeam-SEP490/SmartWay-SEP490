import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { StopOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Modal, Tabs } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IStaff } from 'app/shared/model/staff.model';
import { createEntity, updateEntity, validateEmail, validatePhone } from 'app/pages/tenant/management/staff/staff.reducer';
import RoleSelect from 'app/pages/tenant/management/role/role-component';

export const StaffForm = ({ staff, isOpen, handleClose }: { staff?: IStaff; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [resetPassword, setResetPassword] = useState(false);
  const isNew = staff?.id === undefined;
  const updating = useAppSelector(state => state.staff.updating);
  const updateSuccess = useAppSelector(state => state.staff.updateSuccess);

  useEffect(() => {
    if (!isNew) {
      form.setFieldsValue({ ...staff });
      setResetPassword(false);
    } else {
      form.resetFields();
    }
  }, [isNew]);

  useEffect(() => {
    if (updateSuccess) {
      form.resetFields();
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...staff,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const handleResetPasswordChange = e => {
    setResetPassword(e.target.checked);
  };

  return (
    <>
      <Modal
        open={isOpen}
        destroyOnClose
        centered
        width={1000}
        title={
          <Translate
            contentKey={isNew ? 'entity.label.addNew' : 'entity.label.edit'}
            interpolate={{ entity: translate('global.menu.entities.staff').toLowerCase() }}
          />
        }
        footer={[]}
        onCancel={() => handleClose()}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} colon onFinish={saveEntity}>
          <Tabs className="p-2">
            <Tabs.TabPane tab={translate('menuItem.infoTabs.information')} key={1} className="flex gap-8 p-2">
              <div className="flex-grow">
                <Form.Item
                  label={translate('staff.username.label')}
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
                  label={translate('staff.fullName.label')}
                  name={'fullName'}
                  rules={[
                    { required: true, message: translate('entity.validation.required') },
                    { max: 100, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label={translate('staff.role.label')} name="id" required>
                  <RoleSelect />
                </Form.Item>
              </div>
              <div className="flex-grow">
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
                {!isNew ? (
                  <>
                    <Checkbox onChange={handleResetPasswordChange} className="font-normal mb-2 ml-28 ">
                      {translate('staff.resetPassword.label')}
                    </Checkbox>
                    {resetPassword && (
                      <Form.Item
                        label={translate('staff.password.label')}
                        name="password"
                        rules={[
                          { required: true, message: translate('entity.validation.required') },
                          { max: 60, message: translate('entity.validation.max', { max: 60 }) },
                          { min: 4, message: translate('entity.validation.min', { min: 4 }) },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    )}
                  </>
                ) : (
                  <>
                    <Form.Item
                      label={translate('staff.password.label')}
                      name="password"
                      rules={[
                        { required: true, message: translate('entity.validation.required') },
                        { max: 60, message: translate('entity.validation.max', { max: 60 }) },
                        { min: 4, message: translate('entity.validation.min', { min: 4 }) },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </>
                )}
              </div>
            </Tabs.TabPane>
          </Tabs>
          <div className="flex justify-end gap-2">
            <SubmitButton form={form} isNew={isNew} updating={updating} />
            <Button type="default" htmlType="reset" onClick={() => handleClose()}>
              <StopOutlined rev={''} />
              <Translate contentKey="entity.action.back">Back</Translate>
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default StaffForm;
