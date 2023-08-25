import { DeleteFilled, EditFilled, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Modal, Radio, Typography } from 'antd';
import Tree, { DataNode } from 'antd/es/tree';
import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IRole } from 'app/shared/model/role.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { RoleForm } from './role-form';
import { getEntities } from './role.reducer';
import RoleDelete from './role-delete';
import { MdManageAccounts } from 'react-icons/md';

export const Role = () => {
  const dispatch = useAppDispatch();

  const roleList = useAppSelector(state => state.role.entities);
  const loading = useAppSelector(state => state.role.loading);

  const [selectedRole, setSelectedRole] = useState<IRole>();
  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState<boolean>(false);
  const updateSuccess = useAppSelector(state => state.role.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      setIsShowForm(false);
    }
  }, [updateSuccess]);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  useEffect(() => {
    if (!loading) {
      setSelectedRole(roleList[0]);
    }
  }, [loading, roleList]);

  const handleOnChange = e => {
    const id = e.target.value;
    const nextSelectedRole = roleList.find(role => role.id === id);
    setSelectedRole(nextSelectedRole);
  };

  const handleAddNew = () => {
    setIsShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <div className="flex items-center justify-between p-2">
        <Typography.Title level={3} className="!mb-0">
          <Translate contentKey="role.title" />
        </Typography.Title>
        <div className="flex gap-2">
          <Button type="primary" icon={<PlusOutlined rev={''} />} onClick={handleAddNew}>
            <Translate contentKey="role.addNewLabel" />
          </Button>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/4 p-2">
          <Card className="" loading={loading} bordered={false}>
            <Typography.Title level={5}>Role list</Typography.Title>
            {roleList?.length > 0 ? (
              <Radio.Group
                className="flex flex-col border border-solid border-slate-200"
                onChange={handleOnChange}
                value={selectedRole?.id}
                buttonStyle="solid"
              >
                {roleList.map(role => (
                  <Radio.Button
                    key={role.id}
                    value={role.id}
                    className="flex font-normal !border-none !rounded-none before:!bg-none bg-none hover:bg-blue-50"
                  >
                    {role.name}
                  </Radio.Button>
                ))}
              </Radio.Group>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
            )}
          </Card>
        </div>
        <div className="w-3/4 p-2">
          <Card loading={loading} bordered={false}>
            {selectedRole === undefined ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
            ) : (
              <>
                <div className="flex justify-between pb-2 mb-2 border-0 border-b border-solid border-slate-200">
                  <div className="flex items-center w-1/2 gap-2">
                    <div className="flex items-center text-blue-600">
                      <MdManageAccounts size={24} />
                    </div>
                    <Typography.Title level={5} className="!mb-0 !text-blue-600">
                      {selectedRole?.name}
                    </Typography.Title>
                  </div>
                  <div className="flex gap-2">
                    <Button danger type="primary" icon={<DeleteFilled rev={''} />} onClick={() => setIsShowDeleteConfirm(true)}>
                      <Translate contentKey="entity.action.delete" />
                    </Button>
                  </div>
                </div>
                <RoleForm role={selectedRole} handleCancel={() => setSelectedRole(selectedRole)} />
              </>
            )}
          </Card>
        </div>
      </div>
      <Modal
        destroyOnClose
        onCancel={() => setIsShowForm(false)}
        centered
        open={isShowForm}
        width={1000}
        title={
          <Translate contentKey={'entity.label.addNew'} interpolate={{ entity: translate('global.menu.entities.role')?.toLowerCase() }} />
        }
        footer={[]}
      >
        <RoleForm role={{}} handleCancel={() => setIsShowForm(false)} />
      </Modal>
      <RoleDelete role={selectedRole} handleClose={() => setIsShowDeleteConfirm(false)} isOpen={isShowDeleteConfirm} />
    </div>
  );
};
export default Role;
