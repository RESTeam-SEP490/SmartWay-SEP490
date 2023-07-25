import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Button, Card, Checkbox, Empty, Form, Select, Typography } from 'antd';
import { getEntities } from './menu-item-category.reducer';
import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Translate, translate } from 'react-jhipster';
import { FormType } from 'app/app.constant';
import MenuItemCategoryForm from './menu-item-category-form';
import { IMenuItemCategory } from 'app/shared/model/menu-item-category.model';
import MenuItemCategoryDelete from './menu-item-category-delete';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Scrollbars from 'react-custom-scrollbars-2';

export const MenuItemCategorySelect = () => {
  const [isShowForm, setIsShowForm] = useState(false);

  const categoryList = useAppSelector(state => state.menuItemCategory.entities).map(c => ({ value: c.id, label: c.name }));
  const loading = useAppSelector(state => state.menuItemCategory.loading);
  const updateSuccess = useAppSelector(state => state.menuItemCategory.updateSuccess);

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
        rules={[{ required: true, message: translate('entity.validation.required') }]}
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

export const MenuItemCategoryCheckBoxes = ({ onFilter }: { onFilter: any }) => {
  const dispatch = useAppDispatch();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IMenuItemCategory>();

  const categoryList = useAppSelector(state => state.menuItemCategory.entities);
  const [selectedCategoryList, setSelectedCategoryList] = useState<CheckboxValueType[]>(categoryList.map(c => c.id));

  const loading = useAppSelector(state => state.menuItemCategory.loading);
  const updateSuccess = useAppSelector(state => state.menuItemCategory.updateSuccess);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  useEffect(() => {
    onFilter(selectedCategoryList);
  }, [selectedCategoryList]);

  const handleOpen = (formType: FormType, category: IMenuItemCategory) => {
    setSelectedCategory(category);
    if (formType === 'delete') setIsShowDeleteConfirm(true);
    else setIsShowForm(true);
  };

  const handleClose = (formType: FormType) => {
    setSelectedCategory(undefined);
    if (formType === 'delete') setIsShowDeleteConfirm(false);
    else setIsShowForm(false);
  };

  const handleOnchange = (values: CheckboxValueType[]) => {
    setSelectedCategoryList(values);
  };

  return (
    <>
      <Card loading={loading}>
        <div className="flex justify-between">
          <Typography.Title level={5}>
            <Translate contentKey="menuItem.category.label" />
          </Typography.Title>
          <Button type="primary" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
            <PlusOutlined rev={''} />
          </Button>
        </div>
        {categoryList.length > 0 ? (
          <Scrollbars className="!w-[calc(100%+8px)]" autoHeight autoHeightMax={300}>
            <Checkbox.Group className="flex-col w-full pr-2 h-fit" value={selectedCategoryList} onChange={handleOnchange}>
              {categoryList.map(category => (
                <div className="flex justify-between w-full py-2 " key={'checkbox'}>
                  <Checkbox
                    key={category.id}
                    value={category.id}
                    className={
                      '!font-normal hover:text-black w-[calc(100%-48px)] checkbox-filters' +
                      (selectedCategoryList.some(c => c.toString() === category.id) ? '' : ' !text-gray-500')
                    }
                  >
                    {category.name}
                  </Checkbox>
                  <div className="flex">
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('edit', category)}>
                      <EditFilled className="text-slate-300 hover:text-blue-500" rev={''} />
                    </Button>
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('delete', category)}>
                      <DeleteOutlined className="text-slate-300 hover:text-red-400" rev={''} />
                    </Button>
                  </div>
                </div>
              ))}
            </Checkbox.Group>
          </Scrollbars>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
        )}
      </Card>
      <MenuItemCategoryForm category={selectedCategory} isOpen={isShowForm} handleClose={() => handleClose('edit')} />
      <MenuItemCategoryDelete category={selectedCategory} isOpen={isShowDeleteConfirm} handleClose={() => handleClose('delete')} />
    </>
  );
};

export default MenuItemCategorySelect;
