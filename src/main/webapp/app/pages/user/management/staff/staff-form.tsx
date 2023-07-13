import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { StopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tabs } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IStaff } from 'app/shared/model/staff.model';
import { createEntity, updateEntity } from 'app/pages/user/management/staff/staff.reducer';
import RoleSelect from 'app/pages/user/management/role/role-component';

export const StaffForm = ({ staff, isOpen, handleClose }: { staff?: IStaff; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const isNew = staff?.id === undefined;
  const updating = useAppSelector(state => state.staff.updating);
  const updateSuccess = useAppSelector(state => state.staff.updateSuccess);

  useEffect(() => {
    if (!isNew) {
      form.setFieldsValue({ ...staff });
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

  return (
    <>
      <Modal
        open={isOpen}
        destroyOnClose
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
                    { max: 100, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label={translate('staff.fullName.label')} name={'fullName'}>
                  <Input />
                </Form.Item>
                <Form.Item label={translate('staff.role.label')} name="id">
                  <RoleSelect />
                </Form.Item>
              </div>
              <div className="flex-grow">
                <Form.Item
                  label={translate('staff.password.label')}
                  name="password"
                  rules={[
                    { required: true, message: translate('entity.validation.required') },
                    { max: 100, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label={translate('staff.email.label')}
                  name={'email'}
                  rules={[{ required: true, message: translate('entity.validation.required') }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label={translate('staff.phone.label')} name={'phone'}>
                  <Input />
                </Form.Item>
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
