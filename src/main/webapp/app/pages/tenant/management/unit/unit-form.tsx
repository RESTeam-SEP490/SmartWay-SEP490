import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { StopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IUnit } from 'app/shared/model/unit.model';
import { createEntity, updateEntity } from './unit.reducer';
import MenuItemCategoryForm from 'app/pages/tenant/management/menu-item-category/menu-item-category-form';

export const UnitForm = ({ unit, isOpen, handleClose }: { unit?: IUnit; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const isNew = unit?.id === undefined;
  const [form] = Form.useForm();
  const updating = useAppSelector(state => state.unit.updating);
  const updateSuccess = useAppSelector(state => state.unit.updateSuccess);

  useEffect(() => {
    if (!isNew) form.setFieldsValue({ ...unit });
    else form.resetFields();
  }, [isNew]);

  useEffect(() => {
    if (updateSuccess) {
      form.resetFields();
      handleClose();
    }
  }, [updateSuccess]);
  const saveEntity = values => {
    const entity = {
      ...unit,
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
        destroyOnClose
        onCancel={handleClose}
        centered
        open={isOpen}
        width={550}
        title={
          <Translate
            contentKey={isNew ? 'entity.label.addNew' : 'entity.label.edit'}
            interpolate={{ entity: translate('global.menu.entities.unit')?.toLowerCase() }}
          />
        }
        footer={[]}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} colon onFinish={saveEntity} className="!mt-8">
          <Form.Item
            label={translate('unit.name')}
            rules={[
              { required: true, message: translate('entity.validation.required') },
              { max: 30, message: translate('entity.validation.max', { max: 30 }) },
            ]}
            name={'name'}
          >
            <Input />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <SubmitButton form={form} isNew={isNew} updating={updating} />
            <Button type="default" onClick={() => handleClose()}>
              <StopOutlined rev={''} />
              <Translate contentKey="entity.action.back">Back</Translate>
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};
export default UnitForm;
