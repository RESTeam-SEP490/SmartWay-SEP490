import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Button, Card, Checkbox, Empty, Form, Modal, Select, Typography } from 'antd';
import { getEntities } from './menu-item-category.reducer';
import { DeleteOutlined, EditFilled, EditOutlined, PlusOutlined, PlusSquareFilled } from '@ant-design/icons';
import locale from 'app/shared/reducers/locale';
import { Translate, translate } from 'react-jhipster';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import MenuItemCategoryForm from './menu-item-category-form';
import { IMenuItemCategory } from 'app/shared/model/menu-item-category.model';
import MenuItemCategoryDelete from './menu-item-category-delete';

export const MenuItemCategorySelect = () => {
  const dispatch = useAppDispatch();
  const [isShowForm, setIsShowForm] = useState(false);

  const categoryList = useAppSelector(state => state.menuItemCategory.entities).map(c => ({ value: c.id, label: c.name }));
  const loading = useAppSelector(state => state.menuItemCategory.loading);
  const updateSuccess = useAppSelector(state => state.menuItemCategory.updateSuccess);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      setIsShowForm(false);
    }
  }, [updateSuccess]);

  return (
    <div className="flex items-center gap-2">
      <Form.Item
        name={['menuItemCategory', 'id']}
        className="flex-grow"
        rules={[{ required: true, message: translate('menuItem.validate.category.required') }]}
      >
        <Select
          showSearch
          loading={loading}
          options={categoryList}
          placeholder={translate('menuItem.category.placeholder')}
          className=""
          notFoundContent={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={translate(categoryList.length > 0 ? 'global.form.search.nodata' : 'global.table.empty')}
            />
          }
        ></Select>
      </Form.Item>
      <Button className="mb-6" type="text" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
        <PlusOutlined className="text-slate-500" rev={''} />
      </Button>
      <MenuItemCategoryForm isOpen={isShowForm} handleClose={() => setIsShowForm(false)} />
    </div>
  );
};

export const MenuItemCategoryCheckBoxes = ({ handleOnChange }) => {
  const dispatch = useAppDispatch();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IMenuItemCategory>();

  const categoryList = useAppSelector(state => state.menuItemCategory.entities);
  const loading = useAppSelector(state => state.menuItemCategory.loading);
  const updateSuccess = useAppSelector(state => state.menuItemCategory.updateSuccess);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      setIsShowForm(false);
    }
  }, [updateSuccess]);

  const handleOpenDelete = category => {
    setSelectedCategory(category);
    setIsShowDeleteConfirm(true);
  };

  const handleOpenEdit = category => {
    setSelectedCategory(category);
    setIsShowForm(true);
  };

  return (
    <>
      <Card bordered={false} loading={loading}>
        <div className="flex justify-between">
          <Typography.Title level={5}>
            <Translate contentKey="menuItem.category.label" />
          </Typography.Title>
          <Button type="primary" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
            <PlusOutlined rev={''} />
          </Button>
        </div>
        <Checkbox.Group className="flex-col w-full" onChange={handleOnChange}>
          {categoryList.length > 0 ? (
            categoryList.map(category => (
              <div className="flex justify-between py-2" key={'checkbox'}>
                <Checkbox key={category.id} value={category.id} className="!font-normal">
                  {category.name}
                </Checkbox>
                <div className="">
                  <Button type="link" size="small" shape="circle" onClick={() => handleOpenEdit(category)}>
                    <EditFilled className="text-slate-300 hover:text-yellow-400" rev={''} />
                  </Button>
                  <Button type="link" size="small" shape="circle" onClick={() => handleOpenDelete(category)}>
                    <DeleteOutlined className="text-slate-300 hover:text-red-400" rev={''} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
          )}
        </Checkbox.Group>
      </Card>
      <MenuItemCategoryForm category={selectedCategory} isOpen={isShowForm} handleClose={() => setIsShowForm(false)} />
      <MenuItemCategoryDelete category={selectedCategory} isOpen={isShowDeleteConfirm} handleClose={() => setIsShowDeleteConfirm(false)} />
    </>
  );
};

export default MenuItemCategorySelect;
