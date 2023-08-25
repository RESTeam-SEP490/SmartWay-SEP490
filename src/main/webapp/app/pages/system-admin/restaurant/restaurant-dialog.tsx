import { CheckSquareFilled, StopOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';
import { IRestaurantWithAdmin } from 'app/shared/model/restaurant-with-admin.model';
import { updateIsActiveEntity } from 'app/pages/system-admin/restaurant/restaurant.reducer';

export const RestaurantWithAdminDialog = ({
  restaurantWithAdmin,
  isOpen,
  handleClose,
  isActive,
}: {
  restaurantWithAdmin: IRestaurantWithAdmin[];
  isOpen: boolean;
  handleClose: any;
  isActive?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const updating = useAppSelector(state => state.restaurantWithAdmin.updating);
  const updateSuccess = useAppSelector(state => state.restaurantWithAdmin.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);
  console.log(restaurantWithAdmin);
  const handleOk = () => {
    const selectedItemIds = restaurantWithAdmin.map(item => item.id);
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
        {restaurantWithAdmin.length === 1 ? (
          isActive ? (
            <Translate contentKey="restaurant.action.allowSellOne.question" interpolate={{ id: restaurantWithAdmin[0].id }} />
          ) : (
            <Translate contentKey="restaurant.action.stopSellOne.question" interpolate={{ id: restaurantWithAdmin[0].id }} />
          )
        ) : isActive ? (
          <Translate contentKey="restaurant.action.allowSell.question" interpolate={{ number: restaurantWithAdmin.length }} />
        ) : (
          <Translate contentKey="restaurant.action.stopSell.question" interpolate={{ number: restaurantWithAdmin.length }} />
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

export default RestaurantWithAdminDialog;
