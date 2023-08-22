import { CheckSquareFilled, StopOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';
import { IAdminRestaurant } from 'app/shared/model/adminRestaurant';
import { updateIsActiveEntity } from 'app/pages/admin/restaurant/admin-restaurnat.reducer';

export const AdminRestaurantDialog = ({
  adminRestaurant,
  isOpen,
  handleClose,
  isActive,
}: {
  adminRestaurant: IAdminRestaurant[];
  isOpen: boolean;
  handleClose: any;
  isActive?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const updating = useAppSelector(state => state.adminRestaurant.updating);
  const updateSuccess = useAppSelector(state => state.adminRestaurant.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);
  console.log(adminRestaurant);
  const handleOk = () => {
    const selectedItemIds = adminRestaurant.map(item => item.id);
    if (isActive !== undefined) {
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
      <Typography>
        {adminRestaurant.length === 1 ? (
          isActive ? (
            <Translate contentKey="restaurant.action.allowSellOne.question" interpolate={{ id: adminRestaurant[0].id }} />
          ) : (
            <Translate contentKey="restaurant.action.stopSellOne.question" interpolate={{ id: adminRestaurant[0].id }} />
          )
        ) : isActive ? (
          <Translate contentKey="restaurant.action.allowSell.question" interpolate={{ number: adminRestaurant.length }} />
        ) : (
          <Translate contentKey="restaurant.action.stopSell.question" interpolate={{ number: adminRestaurant.length }} />
        )}
      </Typography>

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

export default AdminRestaurantDialog;
