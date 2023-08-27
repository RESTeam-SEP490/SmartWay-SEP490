import { StopOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Modal, Select } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IRole } from 'app/shared/model/role.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { createEntity, updateEntity } from './role.reducer';
import { AUTHORITIES } from 'app/config/constants';

export const RoleForm = ({ role, handleCancel }: { role: IRole; handleCancel: any }) => {
  const dispatch = useAppDispatch();

  const [authorities, setAuthorities] = useState([]);
  const [isOrderCustomize, setIsOrderCustomize] = useState(false);
  const [form] = Form.useForm();
  const updating = useAppSelector(state => state.role.updating);

  const isNew = role?.id === undefined;

  useEffect(() => {
    if (isNew) {
      form.resetFields();
      setAuthorities([]);
    } else {
      form.setFieldsValue({ ...role });
      setAuthorities(role.authorities);
      setIsOrderCustomize(checkOrderCustomize(role.authorities));
    }
  }, [role]);

  useEffect(() => {
    form.setFieldValue('authorities', authorities);
  }, [authorities]);

  const checkOrderCustomize = auths => {
    const pers = [AUTHORITIES.ORDER_ADD_AND_CANCEL, AUTHORITIES.ORDER_CHECKOUT, AUTHORITIES.ORDER_DISCOUNT];
    return !pers.every(p => auths.includes(p)) && pers.some(p => auths.includes(p));
  };

  const onSubmit = values => {
    if (isNew) {
      dispatch(createEntity({ ...values }));
    } else {
      dispatch(updateEntity({ ...role, ...values }));
    }
  };

  const onChangeRolePermissions = (permission, isAdd) => {
    const changeRoleList = perm => {
      const isIncluded = authorities.includes(perm);
      if (isAdd && !isIncluded) setAuthorities(prev => [...prev, perm]);
      else if (!isAdd) setAuthorities(prev => prev.filter(per => per !== perm));
    };

    if (typeof permission === 'object') {
      permission.forEach(p => {
        changeRoleList(p);
      });
    } else changeRoleList(permission);
  };
  console.log(form.getFieldsValue(), authorities);

  return (
    <Form form={form} labelAlign="left" requiredMark={false} onFinish={onSubmit} className={isNew ? '!mt-4' : ''}>
      {isNew && (
        <>
          <div className="flex justify-between py-4 mb-4">
            <div className="flex items-center w-1/2 gap-2">
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
          <div className="font-semibold">Permissions</div>
          <div className="text-sm text-gray-400">Customize which permissions the user has this role can access.</div>
          <div className="mt-4 border-t border-t-slate-200"></div>
        </>
      )}
      <div className="flex flex-col gap-5 divide-y divide-slate-100">
        <div className="grid grid-cols-2 px-4 pt-2 gap-x-8 gap-y-4">
          <div className="flex items-center justify-between">
            <div className="">
              <div>Dashboard</div>
              <span className="text-sm text-gray-400">View statistic of restaurant activities </span>
            </div>
            <Select
              className="!w-28"
              value={authorities.includes(AUTHORITIES.DASHBOARD)}
              onSelect={value => onChangeRolePermissions(AUTHORITIES.DASHBOARD, value)}
            >
              <Select.Option value={false}>No access</Select.Option>
              <Select.Option value={true}>Can access</Select.Option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 px-4 pt-2 gap-x-8 gap-y-4">
          <div className="flex items-center justify-between">
            <div className="">
              <div>Role management</div>
              <span className="text-sm text-gray-400">View list, edit and delete roles</span>
            </div>
            <Select
              className="!w-28"
              value={authorities.includes(AUTHORITIES.STAFFROLE)}
              onSelect={value => onChangeRolePermissions(AUTHORITIES.STAFFROLE, value)}
            >
              <Select.Option value={false}>No access</Select.Option>
              <Select.Option value={true}>Can access</Select.Option>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div>Staff management</div>
              <span className="text-sm text-gray-400">View list, edit and delete staff</span>
            </div>
            <Select
              className="!w-28"
              value={authorities.includes(AUTHORITIES.STAFF)}
              onSelect={value => onChangeRolePermissions(AUTHORITIES.STAFF, value)}
            >
              <Select.Option value={false}>No access</Select.Option>
              <Select.Option value={true}>Can access</Select.Option>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div>Menu management</div>
              <span className="text-sm text-gray-400">View list, edit and delete menu items</span>
            </div>
            <Select
              className="!w-28"
              value={authorities.includes(AUTHORITIES.MENUITEM)}
              onSelect={value => onChangeRolePermissions(AUTHORITIES.MENUITEM, value)}
            >
              <Select.Option value={false}>No access</Select.Option>
              <Select.Option value={true}>Can access</Select.Option>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div>Table management</div>
              <span className="text-sm text-gray-400">View list, edit and delete tables</span>
            </div>
            <Select
              className="!w-28"
              value={authorities.includes(AUTHORITIES.TABLE)}
              onSelect={value => onChangeRolePermissions(AUTHORITIES.TABLE, value)}
            >
              <Select.Option value={false}>No access</Select.Option>
              <Select.Option value={true}>Can access</Select.Option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 px-4 pt-2 gap-x-8 gap-y-4">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="">
                <div>Order</div>
                <span className="text-sm text-gray-400">Add, cancel order and check out </span>
              </div>
              <Select
                className="!w-28"
                value={
                  isOrderCustomize || checkOrderCustomize(authorities)
                    ? 'customize'
                    : authorities.includes(AUTHORITIES.ORDER_ADD_AND_CANCEL)
                    ? true
                    : false
                }
                onSelect={value => {
                  if (typeof value === 'string') {
                    setIsOrderCustomize(true);
                  } else {
                    setIsOrderCustomize(false);
                    onChangeRolePermissions(
                      [AUTHORITIES.ORDER_ADD_AND_CANCEL, AUTHORITIES.ORDER_CHECKOUT, AUTHORITIES.ORDER_DISCOUNT],
                      value
                    );
                  }
                }}
              >
                <Select.Option value={false}>No access</Select.Option>
                <Select.Option value={'customize'}>Customize</Select.Option>
                <Select.Option value={true}>Full access</Select.Option>
              </Select>
            </div>
            {isOrderCustomize && (
              <Checkbox.Group
                value={authorities}
                onChange={checkedValues => {
                  const permissions = [AUTHORITIES.ORDER_ADD_AND_CANCEL, AUTHORITIES.ORDER_CHECKOUT, AUTHORITIES.ORDER_DISCOUNT];
                  permissions.forEach(per => {
                    const isAdd = checkedValues.map(value => value.toString()).includes(per);
                    onChangeRolePermissions(per, isAdd);
                    if (!isAdd) {
                      if (per === AUTHORITIES.ORDER_ADD_AND_CANCEL) {
                        onChangeRolePermissions([AUTHORITIES.ORDER_CHECKOUT, AUTHORITIES.ORDER_DISCOUNT], false);
                      } else if (per === AUTHORITIES.ORDER_CHECKOUT) onChangeRolePermissions(AUTHORITIES.ORDER_DISCOUNT, false);
                    }
                  });
                }}
                className="flex-col gap-1 mt-2 ml-4 label-font-normal"
              >
                <Checkbox value={AUTHORITIES.ORDER_ADD_AND_CANCEL}>Add and cancel order</Checkbox>
                <Checkbox disabled={!authorities.includes(AUTHORITIES.ORDER_ADD_AND_CANCEL)} value={AUTHORITIES.ORDER_CHECKOUT}>
                  Check out
                </Checkbox>
                <Checkbox disabled={!authorities.includes(AUTHORITIES.ORDER_CHECKOUT)} value={AUTHORITIES.ORDER_DISCOUNT}>
                  Add discount
                </Checkbox>
              </Checkbox.Group>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div>Kitchen</div>
              <span className="text-sm text-gray-400">View list of ordered items and change their status</span>
            </div>
            <Select
              className="!w-48"
              value={[AUTHORITIES.KITCHEN_PREPARING_ITEM, AUTHORITIES.KITCHEN_RTS_ITEM].every(p => authorities.includes(p))}
              onSelect={value => {
                onChangeRolePermissions([AUTHORITIES.KITCHEN_PREPARING_ITEM, AUTHORITIES.KITCHEN_RTS_ITEM], value);
              }}
            >
              <Select.Option value={false}>No access</Select.Option>
              <Select.Option value={true}>Full access</Select.Option>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div>Bill</div>
              <span className="text-sm text-gray-400">View list and delete bills</span>
            </div>
            <Select
              className="!w-28"
              defaultValue={
                authorities.includes(AUTHORITIES.BILL_VIEW_ONLY)
                  ? 'view_only'
                  : authorities.includes(AUTHORITIES.BILL_FULL_ACCESS)
                  ? true
                  : false
              }
              onSelect={value => {
                if (typeof value === 'string') {
                  onChangeRolePermissions(AUTHORITIES.BILL_VIEW_ONLY, true);
                  onChangeRolePermissions(AUTHORITIES.BILL_FULL_ACCESS, false);
                } else if (value) {
                  onChangeRolePermissions(AUTHORITIES.BILL_FULL_ACCESS, value);
                  onChangeRolePermissions(AUTHORITIES.BILL_VIEW_ONLY, false);
                } else onChangeRolePermissions([AUTHORITIES.BILL_FULL_ACCESS, AUTHORITIES.BILL_VIEW_ONLY], value);
              }}
            >
              <Select.Option value={false}>No access</Select.Option>
              <Select.Option value={'view_only'}>View only</Select.Option>
              <Select.Option value={true}>Full access</Select.Option>
            </Select>
          </div>
        </div>
      </div>
      <Form.Item name={'authorities'} initialValue={authorities} hidden>
        <Checkbox.Group value={authorities} />
      </Form.Item>
      <div className="flex justify-end gap-2 mt-6">
        <SubmitButton isNew={isNew} form={form} updating={updating} />
        <Button type="default" icon={<StopOutlined rev={''} />} onClick={handleCancel}>
          <Translate contentKey="entity.action.cancel" />
        </Button>
      </div>
    </Form>
  );
};
