import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { SaveFilled, StopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tabs, Typography, message } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import MenuItemCategorySelect from './menu-item-category';
import { createEntity, getEntity, updateEntity } from './menu-item-category.reducer';
import { IMenuItemCategory, defaultValue } from 'app/shared/model/menu-item-category.model';

export const MenuItemCategoryForm = ({
  category,
  isOpen,
  handleClose,
}: {
  category?: IMenuItemCategory;
  isOpen: boolean;
  handleClose: any;
}) => {
  const dispatch = useAppDispatch();

  const isNew = category?.id === undefined;
  console.log(isNew);

  const menuItemCategory = useAppSelector(state => state.menuItemCategory.entity);
  const updating = useAppSelector(state => state.menuItemCategory.updating);

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
    return isNew ? m : category;
  };

  return (
    <>
      <Modal
        destroyOnClose
        onCancel={handleClose}
        centered
        open={isOpen}
        width={550}
        title={<Translate contentKey="menuItemCategory.addNewLabel" />}
        footer={[]}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon onFinish={saveEntity} initialValues={isNew ? {} : category} className="!mt-8">
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
            <Button type="primary" htmlType="submit" loading={updating}>
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
