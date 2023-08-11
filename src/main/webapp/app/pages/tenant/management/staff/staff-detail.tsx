import React, { useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { CheckSquareFilled, DeleteFilled, EditFilled, LockFilled } from '@ant-design/icons';
import { Button, Form, Input, Tabs, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch } from 'app/config/store';
import { IStaff } from 'app/shared/model/staff.model';
import StaffDelete from './staff-dialog';

export const StaffDetail = ({ staff, onUpdate }: { staff: IStaff; onUpdate: any }) => {
  const dispatch = useAppDispatch();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isActive, setIsActive] = useState<boolean>();

  const handleDelete = () => {
    setIsActive(undefined);
    setIsShowDialog(true);
  };

  const handleUpdateIsActive = () => {
    setIsActive(!staff.isActive);
    setIsShowDialog(true);
  };

  return (
    <>
      <Tabs defaultValue={1}>
        <Tabs.TabPane tab={translate('staff.information.label')} key={1} className="p-4 details max-w-[calc((100vw-32px)*4/5-66px)]">
          <div className="">
            <Typography.Title level={4}>{staff.username}</Typography.Title>
          </div>

          <div className="flex">
            <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon className="flex-grow">
              <Form.Item className="!mb-0" label={translate('staff.username.label')}>
                <Input bordered={false} value={staff.username} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('staff.fullName.label')}>
                <Input bordered={false} value={staff.fullName} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('staff.email.label')}>
                <Input bordered={false} value={staff.email} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('staff.phone.label')}>
                <Input bordered={false} value={staff.phone} />
              </Form.Item>

              <Form.Item className="!mb-0" label={translate('staff.role.label')}>
                <Input bordered={false} value={staff.role.name} />
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="primary" onClick={onUpdate}>
              <EditFilled rev={''} />
              <Translate contentKey="entity.action.edit" />
            </Button>
            {staff.isActive ? (
              <Button danger type="primary" icon={<LockFilled rev={''} />} onClick={handleUpdateIsActive}>
                <Translate contentKey="staff.action.stopSell" />
              </Button>
            ) : (
              <Button type="primary" icon={<CheckSquareFilled rev={''} />} onClick={handleUpdateIsActive}>
                <Translate contentKey="staff.action.allowSell" />
              </Button>
            )}
            <Button type="primary" danger onClick={handleDelete}>
              <DeleteFilled rev={''} />
              <Translate contentKey="entity.action.delete" />
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
      <StaffDelete staffs={[staff]} handleClose={() => setIsShowDialog(false)} isOpen={isShowDialog} isActive={isActive} />
    </>
  );
};

export default StaffDetail;
