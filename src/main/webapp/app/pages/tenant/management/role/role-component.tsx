import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Card, Checkbox, Empty, Form, Select, Typography } from 'antd';
import { Translate, translate } from 'react-jhipster';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import Scrollbars from 'react-custom-scrollbars-2';
import { IRole } from 'app/shared/model/role';
import { getEntities } from 'app/pages/tenant/management/role/role.reducer';

export const RoleSelect = () => {
  const [isShowForm, setIsShowForm] = useState(false);
  const dispatch = useAppDispatch();

  const roleList = useAppSelector(state => state.role.entities).map(c => ({ value: c.id, label: c.name }));
  const loading = useAppSelector(state => state.role.loading);
  const updateSuccess = useAppSelector(state => state.role.updateSuccess);

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
    </div>
  );
};

export const RoleCheckBoxes = ({ onFilter }: { onFilter: any }) => {
  const dispatch = useAppDispatch();
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
                </div>
              ))}
            </Checkbox.Group>
          </Scrollbars>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
        )}
      </Card>
    </>
  );
};

export default RoleSelect;
