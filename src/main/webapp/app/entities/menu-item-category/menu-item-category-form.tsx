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

  const updating = useAppSelector(state => state.menuItemCategory.updating);

  const saveEntity = values => {
    const entity = {
      ...category,
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
            interpolate={{ entity: translate('global.menu.entities.menuItemCategory').toLowerCase() }}
          />
        }
        footer={[]}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon onFinish={saveEntity} initialValues={isNew ? {} : category} className="!mt-8">
          <Form.Item
            label={translate('menuItemCategory.name')}
            rules={[
              { required: true, message: translate('entity.validation.required') },
              { max: 30, message: translate('entity.validation.max', { max: 30 }) },
            ]}
            name={'name'}
          >
            <Input />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button type="primary" htmlType="submit" loading={updating}>
              <SaveFilled rev={''} />
              <Translate contentKey={isNew ? 'entity.action.save' : 'entity.action.edit'}>Save</Translate>
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
