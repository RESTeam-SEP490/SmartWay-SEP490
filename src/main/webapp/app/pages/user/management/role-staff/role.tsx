import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { Button, Card, Checkbox, Empty, Form, Select, Typography } from 'antd';
import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Translate, translate } from 'react-jhipster';
import { FormType } from 'app/app.constant';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Scrollbars from 'react-custom-scrollbars-2';
import RoleForm from 'app/pages/user/management/role-staff/role-form';
import { IRole } from 'app/shared/model/role';
import { getEntities } from 'app/pages/user/management/role-staff/role.reducer';

export const RoleSelect = () => {
  const [isShowForm, setIsShowForm] = useState(false);
  const dispatch = useAppDispatch();

  const roleList = useAppSelector(state => state.role.entities).map(c => ({ value: c.id, label: c.name }));
  console.log(roleList);
  const loading = useAppSelector(state => state.role.loading);
  const updateSuccess = useAppSelector(state => state.role.updateSuccess);

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
      <Form.Item name={['role', 'id']} className="flex-grow" rules={[{ required: true, message: translate('entity.validation.required') }]}>
        <Select
          showSearch
          loading={loading}
          options={roleList}
          placeholder={translate('staff.role.placeholder')}
          className=""
          notFoundContent={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={translate(roleList.length > 0 ? 'global.form.search.nodata' : 'global.table.empty')}
            />
          }
        ></Select>
      </Form.Item>
      <Button className="mb-6" type="text" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
        <PlusOutlined className="text-slate-500" rev={''} />
      </Button>
      <RoleForm isOpen={isShowForm} handleClose={() => setIsShowForm(false)} />
    </div>
  );
};

export const RoleCheckBoxes = ({ onFilter }: { onFilter: any }) => {
  const dispatch = useAppDispatch();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<IRole>();

  const roleList = useAppSelector(state => state.role.entities);
  const [selectedRoleList, setSelectedRoleList] = useState<CheckboxValueType[]>(roleList.map(r => r.id));

  const loading = useAppSelector(state => state.role.loading);
  const updateSuccess = useAppSelector(state => state.role.updateSuccess);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  useEffect(() => {
    onFilter(selectedRoleList);
  }, [selectedRoleList]);

  const handleOpen = (formType: FormType, role: IRole) => {
    setSelectedRole(role);
    if (formType === 'delete') setIsShowDeleteConfirm(true);
    else setIsShowForm(true);
  };

  const handleClose = (formType: FormType) => {
    setSelectedRole(undefined);
    if (formType === 'delete') setIsShowDeleteConfirm(false);
    else setIsShowForm(false);
  };

  const handleOnchange = (values: CheckboxValueType[]) => {
    setSelectedRoleList(values);
  };

  return (
    <>
      <Card bordered={false} loading={loading}>
        <div className="flex justify-between">
          <Typography.Title level={5}>
            <Translate contentKey="staff.role.label" />
          </Typography.Title>
          <Button type="primary" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
            <PlusOutlined rev={''} />
          </Button>
        </div>
        {roleList.length > 0 ? (
          <Scrollbars className="!w-[calc(100%+8px)]" autoHeight autoHeightMax={300}>
            <Checkbox.Group className="flex-col w-full pr-2 h-fit" value={selectedRoleList} onChange={handleOnchange}>
              {roleList.map(role => (
                <div className="flex justify-between w-full py-2 " key={'checkbox'}>
                  <Checkbox
                    key={role.id}
                    value={role.id}
                    className={
                      '!font-normal hover:text-black w-[calc(100%-48px)] checkbox-filters' +
                      (selectedRoleList.some(c => c.toString() === role.id) ? '' : ' !text-gray-500')
                    }
                  >
                    {role.name}
                  </Checkbox>
                  <div className="flex">
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('edit', role)}>
                      <EditFilled className="text-slate-300 hover:text-blue-500" rev={''} />
                    </Button>
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('delete', role)}>
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
      <RoleForm role={selectedRole} isOpen={isShowForm} handleClose={() => handleClose('edit')} />
      {/*<MenuItemCategoryDelete category={selectedCategory} isOpen={isShowDeleteConfirm} handleClose={() => handleClose('delete')} />*/}
    </>
  );
};

export default RoleSelect;
