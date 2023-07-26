import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Button, Card, Checkbox, Empty, Form, Select, Typography } from 'antd';
import { getEntities } from './unit.reducer';
import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Translate, translate } from 'react-jhipster';
import { FormType } from 'app/app.constant';
import MenuItemCategoryForm, { UnitForm } from './unit-form';
import { IUnit } from 'app/shared/model/unit.model';
import UnitDelete from './unit-delete';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Scrollbars from 'react-custom-scrollbars-2';
import { IMenuItemCategory } from 'app/shared/model/menu-item-category.model';
import MenuItemCategoryDelete from 'app/pages/tenant/management/menu-item-category/menu-item-category-delete';

export const UnitSelect = () => {
  const [isShowForm, setIsShowForm] = useState(false);

  const unitList = useAppSelector(state => state.unit.entities).map(c => ({ value: c.id, label: c.name }));
  const loading = useAppSelector(state => state.unit.loading);
  const updateSuccess = useAppSelector(state => state.unit.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      setIsShowForm(false);
    }
  }, [updateSuccess]);
  return (
    <div className="flex items-center gap-2">
      <Form.Item name={['unit', 'id']} className="flex-grow" rules={[{ required: true, message: translate('entity.validation.required') }]}>
        <Select
          showSearch
          loading={loading}
          options={unitList}
          placeholder={translate('unit.placeholder')}
          className=""
          notFoundContent={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={translate(unitList.length > 0 ? 'global.form.search.nodata' : 'global.table.empty')}
            />
          }
        ></Select>
      </Form.Item>
      <Button className="mb-6" type="text" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
        <PlusOutlined className="text-slate-500" rev={''} />
      </Button>
      <UnitForm isOpen={isShowForm} handleClose={() => setIsShowForm(false)} />
    </div>
  );
};

export const UnitCheckBoxes = ({ onFilter }: { onFilter: any }) => {
  const dispatch = useAppDispatch();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<IUnit>();

  const unitList = useAppSelector(state => state.unit.entities);
  const [selectedUnitList, setSelectedUnitList] = useState<CheckboxValueType[]>(unitList.map(c => c.id));

  const loading = useAppSelector(state => state.unit.loading);
  const updateSuccess = useAppSelector(state => state.unit.updateSuccess);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  useEffect(() => {
    onFilter(selectedUnitList);
  }, [selectedUnitList]);

  const handleOpen = (formType: FormType, unit: IUnit) => {
    setSelectedUnit(unit);
    if (formType === 'delete') setIsShowDeleteConfirm(true);
    else setIsShowForm(true);
  };

  const handleClose = (formType: FormType) => {
    setSelectedUnit(undefined);
    if (formType === 'delete') setIsShowDeleteConfirm(false);
    else setIsShowForm(false);
  };

  const handleOnchange = (values: CheckboxValueType[]) => {
    setSelectedUnitList(values);
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
        {unitList.length > 0 ? (
          <Scrollbars className="!w-[calc(100%+8px)]" autoHeight autoHeightMax={300}>
            <Checkbox.Group className="flex-col w-full pr-2 h-fit" value={selectedUnitList} onChange={handleOnchange}>
              {unitList.map(unit => (
                <div className="flex justify-between w-full py-2 " key={'checkbox'}>
                  <Checkbox
                    key={unit.id}
                    value={unit.id}
                    className={
                      '!font-normal hover:text-black w-[calc(100%-48px)] checkbox-filters' +
                      (selectedUnitList.some(c => c.toString() === unit.id) ? '' : ' !text-gray-500')
                    }
                  >
                    {unit.name}
                  </Checkbox>
                  <div className="flex">
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('edit', unit)}>
                      <EditFilled className="text-slate-300 hover:text-blue-500" rev={''} />
                    </Button>
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('delete', unit)}>
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
      <UnitForm unit={selectedUnit} isOpen={isShowForm} handleClose={() => handleClose('edit')} />
      <UnitDelete unit={selectedUnit} isOpen={isShowDeleteConfirm} handleClose={() => handleClose('delete')} />
    </>
  );
};

export default UnitSelect;
