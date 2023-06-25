import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SaveFilled, StopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tabs, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import MenuItemCategorySelect from './menu-item-category';
import { createEntity, getEntity, updateEntity } from './menu-item-category.reducer';
import { IMenuItemCategory, defaultValue } from 'app/shared/model/menu-item-category.model';

export const MenuItemCategoryForm = ({ id, isOpen, handleClose }: { id?: string; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const isNew = id === undefined;

  const menuItemCategory = useAppSelector(state => state.menuItemCategory.entity);
  const loading = useAppSelector(state => state.menuItemCategory.loading);
  const updating = useAppSelector(state => state.menuItemCategory.updating);
  const updateSuccess = useAppSelector(state => state.menuItemCategory.updateSuccess);

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...menuItemCategory,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () => {
    const m: IMenuItemCategory = defaultValue;
    return isNew ? m : { m, ...menuItemCategory };
  };

  return (
    <>
      <Modal
        centered
        open={isOpen}
        width={500}
        title={<Translate contentKey="menuItemCategory.addNewLabel" />}
        footer={[]}
        onCancel={() => handleClose()}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon initialValues={() => defaultValues()} onFinish={saveEntity} className="!mt-8">
          <Form.Item
            label={translate('menuItemCategory.name')}
            rules={[
              { required: true, message: '' },
              { max: 50, message: '' },
            ]}
            name={'name'}
          >
            <Input />
          </Form.Item>
          <Form.Item label={translate('menuItemCategory.description')} name={'description'}>
            <Input />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button type="primary" htmlType="submit">
              <SaveFilled rev={''} />
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
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

export default MenuItemCategoryForm;
