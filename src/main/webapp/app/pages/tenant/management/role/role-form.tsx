import { StopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tree, Typography } from 'antd';
import { DataNode } from 'antd/es/tree';
import { AUTHORITIES } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IRole } from 'app/shared/model/role.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { createEntity, updateEntity } from './role.reducer';

export const RoleForm = ({ role, isOpen, handleClose }: { role: IRole; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const updateSuccess = useAppSelector(state => state.role.updateSuccess);
  const updating = useAppSelector(state => state.role.updating);

  const [form] = Form.useForm();

  const isNew = role?.id === undefined;

  useEffect(() => {
    if (updateSuccess) {
      form.resetFields();
      setCheckedKeys([]);
      handleClose();
    }
  }, [updateSuccess]);

  const treeData: DataNode[] = [
    {
      title: (
        <Typography.Title level={5}>
          <Translate contentKey="role.labels.role" />
        </Typography.Title>
      ),
      key: 'STAFFROLE',
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
      key: 'STAFF',
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
      key: 'MENUITEM',
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
      key: 'TABLE',
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
      key: 'ORDER',
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
      key: 'BILL',
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

  useEffect(() => {
    if (!isNew) {
      form.setFieldsValue(role);
      setCheckedKeys(role?.authorities);
    } else {
      form.resetFields();
      setCheckedKeys([]);
    }
  }, [isNew, role]);

  const onCheck = (checkedKeysValue, e) => {
    const { checked, node } = e;
    let nextCheckedKeys = [...checkedKeys];
    if (checked) {
      if (node.children) {
        const toAddKeys = node.children.map(child => child.key);
        nextCheckedKeys = [...new Set([...nextCheckedKeys, ...toAddKeys])];
      } else nextCheckedKeys = [...nextCheckedKeys, node.key];
      setCheckedKeys(nextCheckedKeys);
      form.setFieldsValue({ ...form.getFieldsValue, authorities: nextCheckedKeys });
    } else {
      if (node.children) {
        const toRemoveKeys = node.children.map(child => child.key);
        nextCheckedKeys = [...checkedKeys].filter(key => !toRemoveKeys.includes(key));
      } else nextCheckedKeys = [...checkedKeys].filter(key => key !== node.key);
      setCheckedKeys(nextCheckedKeys);
      form.setFieldsValue({ ...form.getFieldsValue, authorities: nextCheckedKeys });
    }
  };

  const onSubmit = values => {
    if (isNew) {
      dispatch(createEntity({ ...values }));
    } else {
      dispatch(updateEntity({ ...role, ...values }));
    }
  };

  return (
    <Modal
      destroyOnClose
      onCancel={handleClose}
      centered
      open={isOpen}
      width={800}
      title={
        <Translate
          contentKey={isNew ? 'entity.label.addNew' : 'entity.label.edit'}
          interpolate={{ entity: translate('global.menu.entities.menuItemCategory')?.toLowerCase() }}
        />
      }
      footer={[]}
    >
      <Form form={form} onFinish={onSubmit} className="!mt-6">
        <div className="flex justify-between mb-4 py-4">
          <div className="w-1/2 flex items-center gap-2">
            <Form.Item
              colon
              name={'name'}
              label={translate('role.labels.name')}
              className="mb-0"
              rules={[
                { required: true, message: translate('entity.validation.required') },
                { max: 100, message: translate('entity.validation.max', { max: 100 }) },
              ]}
            >
              <Input />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          colon
          name={'authorities'}
          className="mb-0 flex-grow"
          rules={[{ required: true, message: translate('entity.validation.required') }]}
        >
          <div className="grid grid-rows-2 grid-flow-col gap-4">
            {treeData.map(data => (
              <Tree
                key={data.key}
                onCheck={onCheck}
                checkable
                defaultExpandAll
                selectable={false}
                checkedKeys={checkedKeys}
                treeData={[data]}
              />
            ))}
          </div>
        </Form.Item>
        <div className="flex mt-6 justify-end gap-2">
          <SubmitButton isNew={isNew} form={form} updating={updating} />
          <Button type="default" icon={<StopOutlined rev={''} />} onClick={handleClose}>
            <Translate contentKey="entity.action.cancel" />
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
