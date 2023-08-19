import { FilterFilled, PrinterFilled } from '@ant-design/icons';
import { Button, Popover, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React from 'react';
import { IMenuItemCategory } from '../../../../../shared/model/menu-item-category.model';
import { useEffect } from 'react';
import { kitchenActions } from '../kitchen.reducer';

export const RTSNavTool = () => {
  const dispatch = useAppDispatch();

  const categoryList = useAppSelector(state => state.menuItemCategory.entities);
  const categoryFilter = useAppSelector(state => state.kitchen.categoryFilter);

  useEffect(() => {
    dispatch(kitchenActions.setCategoryFilter(categoryList.map(c => c.id)));
  }, [categoryList]);

  return (
    <>
      <div className="inline-flex gap-2">
        <Button ghost shape="circle" icon={<PrinterFilled rev="" />}></Button>
        <Popover placement="bottomLeft" trigger={'click'} content={<CategorySelect />}>
          <div className="relative flex">
            <Button ghost shape="circle" icon={<FilterFilled rev="" />}></Button>
            {categoryList.length !== categoryFilter.length && (
              <div className="absolute w-2 h-2 bg-red-600 rounded-full right-2 top-2"></div>
            )}
          </div>
        </Popover>
      </div>
    </>
  );
};

const CategorySelect = () => {
  const dispatch = useAppDispatch();
  const categoryList = useAppSelector(state => state.menuItemCategory.entities);

  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold">Select category:</span>
      <Select
        className="w-52 h-fit"
        mode="multiple"
        defaultValue={categoryList.map(c => c.id)}
        onChange={values => dispatch(kitchenActions.setCategoryFilter(values))}
      >
        {categoryList.map((cate: IMenuItemCategory) => (
          <Select.Option key={cate.id} value={cate.id}>
            {cate.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
