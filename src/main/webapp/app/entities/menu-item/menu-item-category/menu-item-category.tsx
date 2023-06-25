import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Button, Card, Checkbox, Empty, Form, Modal, Select, Typography } from 'antd';
import { getEntities } from './menu-item-category.reducer';
import { DeleteOutlined, EditFilled, EditOutlined, PlusOutlined, PlusSquareFilled } from '@ant-design/icons';
import locale from 'app/shared/reducers/locale';
import { Translate, translate } from 'react-jhipster';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import MenuItemCategoryForm from './menu-item-category-form';

export const MenuItemCategorySelect = () => {
  const dispatch = useAppDispatch();
  const [isShowForm, setIsShowForm] = useState(false);

  const categoryList = useAppSelector(state => state.menuItemCategory.entities).map(c => ({ value: c.id, label: c.name }));
  const loading = useAppSelector(state => state.menuItemCategory.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);
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
          notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.form.search.nodata')} />}
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

  const categoryList = useAppSelector(state => state.menuItemCategory.entities).map(c => ({ value: c.id, label: c.name }));
  const loading = useAppSelector(state => state.menuItemCategory.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  return (
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
        {categoryList.map((c, i) => (
          <div className="py-2 flex justify-between" key={'checkbox'}>
            <Checkbox key={c.value} value={c.value} className="!font-normal">
              {c.label}
            </Checkbox>
            <div className="">
              <Button type="link" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
                <EditFilled className="text-slate-300 hover:text-yellow-400" rev={''} />
              </Button>
              <Button type="link" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
                <DeleteOutlined className="text-slate-300 hover:text-red-400" rev={''} />
              </Button>
            </div>
          </div>
        ))}
      </Checkbox.Group>
      <MenuItemCategoryForm isOpen={isShowForm} handleClose={() => setIsShowForm(false)} />
    </Card>
  );
};

export default MenuItemCategorySelect;
