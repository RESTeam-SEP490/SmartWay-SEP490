import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteEntity } from './unit.reducer';
import { IUnit, defaultValue } from 'app/shared/model/unit.model';
import { DeleteFilled, SaveFilled, StopOutlined } from '@ant-design/icons';

export const UnitDelete = ({ unit, isOpen, handleClose }: { unit: IUnit; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const updating = useAppSelector(state => state.unit.updating);
  const updateSuccess = useAppSelector(state => state.unit.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleOk = () => {
    dispatch(deleteEntity(unit.id));
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
        {unit && <Translate contentKey="smartWayApp.unit.delete.question" interpolate={{ name: unit.name }} />}
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

export default UnitDelete;
