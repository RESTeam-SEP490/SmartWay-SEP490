import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DeleteFilled, StopOutlined } from '@ant-design/icons';
import { IRole } from 'app/shared/model/role.model';
import { deleteEntity } from './role.reducer';

export const RoleDelete = ({ role, isOpen, handleClose }: { role: IRole; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const updating = useAppSelector(state => state.role.updating);
  const updateSuccess = useAppSelector(state => state.role.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleOk = () => {
    dispatch(deleteEntity(role.id));
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
      title={<Translate contentKey="entity.action.delete" />}
    >
      <Typography.Text>
        {role && <Translate contentKey="smartWayApp.role.delete.question" interpolate={{ name: role.name }} />}
      </Typography.Text>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="primary" htmlType="submit" loading={updating} onClick={handleOk}>
          <DeleteFilled rev={''} />
          <Translate contentKey="entity.action.delete"></Translate>
        </Button>
        <Button type="default" onClick={() => handleClose()}>
          <StopOutlined rev={''} />
          <Translate contentKey="entity.action.cancel"></Translate>
        </Button>
      </div>
    </Modal>
  );
};

export default RoleDelete;
