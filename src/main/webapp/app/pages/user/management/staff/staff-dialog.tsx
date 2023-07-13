import { CheckSquareFilled, StopOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';
import { IStaff } from 'app/shared/model/staff.model';
import { deleteEntity } from 'app/pages/user/management/staff/staff.reducer';
import { updateIsActiveEntity } from 'app/pages/user/management/menu-item/menu-item.reducer';

export const StaffDialog = ({
  staffs,
  isOpen,
  handleClose,
  isActive,
}: {
  staffs: IStaff[];
  isOpen: boolean;
  handleClose: any;
  isActive?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const updating = useAppSelector(state => state.staff.updating);
  const updateSuccess = useAppSelector(state => state.staff.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleOk = () => {
    const selectedItemIds = staffs.map(item => item.id);
    if (isActive === undefined) {
      dispatch(deleteEntity(selectedItemIds));
    } else {
      const dto: IListUpdateBoolean = { isActive, ids: selectedItemIds };
      dispatch(updateIsActiveEntity(dto));
    }
  };

  return (
    <Modal
      destroyOnClose
      onCancel={handleClose}
      centered
      open={isOpen}
      width={550}
      okButtonProps={{ loading: updating }}
      footer={null}
      title={<Translate contentKey="entity.label.confirm" />}
    >
      <Typography.Text>
        <Translate contentKey="staff.action.delete.question" interpolate={{ code: staffs[0].username }} />
      </Typography.Text>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="primary" icon={<CheckSquareFilled rev={''} />} htmlType="submit" loading={updating} onClick={handleOk}>
          <Translate contentKey="entity.label.confirm"></Translate>
        </Button>
        <Button type="default" onClick={() => handleClose()}>
          <StopOutlined rev={''} />
          <Translate contentKey="entity.action.cancel"></Translate>
        </Button>
      </div>
    </Modal>
  );
};

export default StaffDialog;
