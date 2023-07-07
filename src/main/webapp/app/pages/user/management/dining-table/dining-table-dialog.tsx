import { CheckSquareFilled, DeleteFilled, StopOutlined } from '@ant-design/icons';
import { Button, Modal, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { deleteEntity, updateIsActiveEntity } from './dining-table.reducer';
import { IListUpdateBoolean } from 'app/shared/model/list-update-boolean';

export const DiningTableDialog = ({
  diningTables,
  isOpen,
  handleClose,
}: {
  diningTables: IDiningTable[];
  isOpen: boolean;
  handleClose: any;
}) => {
  const dispatch = useAppDispatch();
  const updating = useAppSelector(state => state.diningTable.updating);
  const updateSuccess = useAppSelector(state => state.diningTable.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleOk = () => {
    const selectedItemIds = diningTables.map(item => item.id);
    // if (isActive === undefined) {
    //   dispatch(deleteEntity(selectedItemIds));
    // } else {
    //   const dto: IListUpdateBoolean = { isActive, ids: selectedItemIds };
    //   dispatch(updateIsActiveEntity(dto));
    // }
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
      {/* {isActive === undefined ? ( */}
      {/*   <Typography.Text> */}
      {/*     {menuItems[0]?.code ? ( */}
      {/*       <Translate contentKey="menuItem.action.delete.question" interpolate={{ code: menuItems[0].code }} /> */}
      {/*     ) : ( */}
      {/*       <Translate contentKey="entity.action.delete.question" interpolate={{ number: menuItems.length }} /> */}
      {/*     )} */}
      {/*   </Typography.Text> */}
      {/* ) : ( */}
      {/*   <Typography> */}
      {/*     {menuItems[0]?.code ? ( */}
      {/*       isActive ? ( */}
      {/*         <Translate contentKey="menuItem.action.allowSellOne.question" interpolate={{ code: menuItems[0].code }} /> */}
      {/*       ) : ( */}
      {/*         <Translate contentKey="menuItem.action.stopSellOne.question" interpolate={{ code: menuItems[0].code }} /> */}
      {/*       ) */}
      {/*     ) : isActive ? ( */}
      {/*       <Translate contentKey="menuItem.action.allowSell.question" interpolate={{ number: menuItems.length }} /> */}
      {/*     ) : ( */}
      {/*       <Translate contentKey="menuItem.action.stopSell.question" interpolate={{ number: menuItems.length }} /> */}
      {/*     )} */}
      {/*   </Typography> */}
      {/* )} */}
      {/* <div className="flex justify-end gap-2 mt-4"> */}
      {/*   {isActive === undefined ? ( */}
      {/*     <Button type="primary" icon={<DeleteFilled rev={''} />} htmlType="submit" loading={updating} onClick={handleOk}> */}
      {/*       <Translate contentKey="entity.action.delete"></Translate> */}
      {/*     </Button> */}
      {/*   ) : ( */}
      {/*     <Button type="primary" icon={<CheckSquareFilled rev={''} />} htmlType="submit" loading={updating} onClick={handleOk}> */}
      {/*       <Translate contentKey="entity.label.confirm"></Translate> */}
      {/*     </Button> */}
      {/*   )} */}
      {/*   <Button type="default" onClick={() => handleClose()}> */}
      {/*     <StopOutlined rev={''} /> */}
      {/*     <Translate contentKey="entity.action.cancel"></Translate> */}
      {/*   </Button> */}
      {/* </div> */}
    </Modal>
  );
};

export default DiningTableDialog;
