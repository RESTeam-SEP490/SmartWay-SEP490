import { DeleteFilled, EditFilled, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Radio, Typography } from 'antd';
import Tree, { DataNode } from 'antd/es/tree';
import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IRole } from 'app/shared/model/role.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { RoleForm } from './role-form';
import { getEntities } from './role.reducer';
import RoleDelete from './role-delete';

export const Role = () => {
  const dispatch = useAppDispatch();

  const roleList = useAppSelector(state => state.role.entities);
  const loading = useAppSelector(state => state.role.loading);

  const [selectedRole, setSelectedRole] = useState<IRole>();
  const [isShowForm, setIsShowForm] = useState<boolean>(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState<boolean>(false);
  const [inFormRole, setInFormRole] = useState<IRole>();

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

  const treeData: DataNode[] = [
    {
      title: (
        <Typography.Title level={5}>
          <Translate contentKey="role.labels.role" />
        </Typography.Title>
      ),
      key: 'role',
      children: [
        {
          title: <Translate contentKey="role.subLabels.view" />,
          key: AUTHORITIES.STAFFROLE_VIEW,
        },
        {
          title: <Translate contentKey="role.subLabels.create" />,
          key: AUTHORITIES.STAFFROLE_CREATE,
        },
        {
          title: <Translate contentKey="role.subLabels.edit" />,
          key: AUTHORITIES.STAFFROLE_EDIT,
        },
        {
          title: <Translate contentKey="role.subLabels.delete" />,
          key: AUTHORITIES.STAFFROLE_DELETE,
        },
      ],
    },
    {
      title: (
        <Typography.Title level={5}>
          <Translate contentKey="role.labels.staff" />
        </Typography.Title>
      ),
      key: 'staff',
      children: [
        {
          title: <Translate contentKey="role.subLabels.view" />,
          key: AUTHORITIES.STAFF_VIEW,
        },
        {
          title: <Translate contentKey="role.subLabels.create" />,
          key: AUTHORITIES.STAFF_CREATE,
        },
        {
          title: <Translate contentKey="role.subLabels.edit" />,
          key: AUTHORITIES.STAFF_EDIT,
        },
        {
          title: <Translate contentKey="role.subLabels.delete" />,
          key: AUTHORITIES.STAFF_DELETE,
        },
      ],
    },
    {
      title: (
        <Typography.Title level={5}>
          <Translate contentKey="role.labels.menuitem" />
        </Typography.Title>
      ),
      key: 'menuitem',
      children: [
        {
          title: <Translate contentKey="role.subLabels.view" />,
          key: AUTHORITIES.MENUITEM_VIEW,
        },
        {
          title: <Translate contentKey="role.subLabels.create" />,
          key: AUTHORITIES.MENUITEM_CREATE,
        },
        {
          title: <Translate contentKey="role.subLabels.edit" />,
          key: AUTHORITIES.MENUITEM_EDIT,
        },
        {
          title: <Translate contentKey="role.subLabels.delete" />,
          key: AUTHORITIES.MENUITEM_DELETE,
        },
      ],
    },
    {
      title: (
        <Typography.Title level={5}>
          <Translate contentKey="role.labels.table" />
        </Typography.Title>
      ),
      key: 'table',
      children: [
        {
          title: <Translate contentKey="role.subLabels.view" />,
          key: AUTHORITIES.TABLE_VIEW,
        },
        {
          title: <Translate contentKey="role.subLabels.create" />,
          key: AUTHORITIES.TABLE_CREATE,
        },
        {
          title: <Translate contentKey="role.subLabels.edit" />,
          key: AUTHORITIES.TABLE_EDIT,
        },
        {
          title: <Translate contentKey="role.subLabels.delete" />,
          key: AUTHORITIES.TABLE_DELETE,
        },
      ],
    },
    {
      title: (
        <Typography.Title level={5}>
          <Translate contentKey="role.labels.order" />
        </Typography.Title>
      ),
      key: 'order',
      children: [
        {
          title: <Translate contentKey="role.subLabels.waiter" />,
          key: AUTHORITIES.ORDER_WAITER,
        },
        {
          title: <Translate contentKey="role.subLabels.payment" />,
          key: AUTHORITIES.ORDER_PAYMENT,
        },
        {
          title: <Translate contentKey="role.subLabels.discount" />,
          key: AUTHORITIES.ORDER_DISCOUNT,
        },
      ],
    },
    {
      title: (
        <Typography.Title level={5}>
          <Translate contentKey="role.labels.bill" />
        </Typography.Title>
      ),
      key: 'bill',
      children: [
        {
          title: <Translate contentKey="role.subLabels.view" />,
          key: AUTHORITIES.BILL_VIEW,
        },
        {
          title: <Translate contentKey="role.subLabels.edit" />,
          key: AUTHORITIES.BILL_EDIT,
        },
        {
          title: <Translate contentKey="role.subLabels.delete" />,
          key: AUTHORITIES.BILL_DELETE,
        },
      ],
    },
  ];

  const handleAddNew = () => {
    setInFormRole({});
    setIsShowForm(true);
  };

  const handleEdit = () => {
    setInFormRole(selectedRole);
    setIsShowForm(true);
  };

  return (
    <div className="mx-auto max-w-6xl mt-4">
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
                <div className="flex justify-between mb-8 pb-2 border-0 border-b border-solid border-slate-200">
                  <div className="w-1/2 flex items-center gap-2">
                    <div className="text-lg text-blue-600 ">
                      <TeamOutlined rev={''} />
                    </div>
                    <Typography.Title level={5} className="!mb-0 !text-blue-600">
                      {selectedRole?.name}
                    </Typography.Title>
                  </div>
                  <div className="flex gap-2">
                    <Button type="primary" icon={<EditFilled rev={''} />} onClick={handleEdit}>
                      <Translate contentKey="entity.action.edit" />
                    </Button>
                    <Button danger type="primary" icon={<DeleteFilled rev={''} />} onClick={() => setIsShowDeleteConfirm(true)}>
                      <Translate contentKey="entity.action.delete" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-rows-2 grid-flow-col gap-4">
                  {treeData.map(data => (
                    <Tree
                      key={data.key}
                      checkable
                      defaultExpandAll
                      selectable={false}
                      checkedKeys={selectedRole?.authorities}
                      treeData={[data]}
                    />
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
      <RoleForm handleClose={() => setIsShowForm(false)} isOpen={isShowForm} role={inFormRole} />
      <RoleDelete role={selectedRole} handleClose={() => setIsShowDeleteConfirm(false)} isOpen={isShowDeleteConfirm} />
    </div>
  );
};
export default Role;
