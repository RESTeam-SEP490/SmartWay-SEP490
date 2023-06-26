import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteEntity } from './menu-item-category.reducer';
import { IMenuItemCategory, defaultValue } from 'app/shared/model/menu-item-category.model';
import { DeleteFilled, SaveFilled, StopOutlined } from '@ant-design/icons';

export const MenuItemCategoryDelete = ({
  category,
  isOpen,
  handleClose,
}: {
  category: IMenuItemCategory;
  isOpen: boolean;
  handleClose: any;
}) => {
  const dispatch = useAppDispatch();
  const updating = useAppSelector(state => state.menuItemCategory.updating);
  const updateSuccess = useAppSelector(state => state.menuItemCategory.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleOk = () => {
    dispatch(deleteEntity(category.id));
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
        {category && <Translate contentKey="smartWayApp.menuItemCategory.delete.question" interpolate={{ name: category.name }} />}
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

export default MenuItemCategoryDelete;
