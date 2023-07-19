import React, { useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { CheckSquareFilled, DeleteFilled, EditFilled, LockFilled } from '@ant-design/icons';
import { Badge, Button, Card, Descriptions, Form, Image, Input, InputNumber, Tabs, Typography } from 'antd';
import { currencyFormatter, DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';

import { useAppDispatch } from 'app/config/store';
import DiningTableDelete from './dining-table-dialog';
import { IDiningTable } from 'app/shared/model/dining-table.model';

export const DiningTableDetail = ({ diningTable, onUpdate }: { diningTable: IDiningTable; onUpdate: any }) => {
  const dispatch = useAppDispatch();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isActive, setIsActive] = useState<boolean>();

  const handleDelete = () => {
    setIsActive(undefined);
    setIsShowDialog(true);
  };

  const handleUpdateisActive = () => {
    setIsActive(!diningTable.isActive);
    setIsShowDialog(true);
  };

  return (
    <>
      <Tabs defaultValue={1}>
        <Tabs.TabPane
          tab={translate('diningTable.infoTabs.information')}
          key={1}
          className="p-4 details max-w-[calc((100vw-32px)*4/5-66px)]"
        >
          <div className="">
            <Typography.Title level={4}></Typography.Title>
          </div>

          <div className="flex">
            <Card title={diningTable.name} className="w-full">
              <Descriptions column={1}>
                <Descriptions.Item label={translate('diningTable.numberOfSeat.label')}>
                  {diningTable.numberOfSeats !== 0 ? diningTable.numberOfSeats : <Translate contentKey="diningTable.message.seat" />}
                </Descriptions.Item>
                <Descriptions.Item label={translate('diningTable.zone.label')}>
                  {diningTable.zone ? diningTable.zone.name : <Translate contentKey="diningTable.message" />}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="primary" onClick={onUpdate}>
              <EditFilled rev={''} />
              <Translate contentKey="entity.action.edit" />
            </Button>
            {diningTable.isActive ? (
              <Button danger type="primary" icon={<LockFilled rev={''} />} onClick={handleUpdateisActive}>
                <Translate contentKey="diningTable.action.stopSell" />
              </Button>
            ) : (
              <Button type="primary" icon={<CheckSquareFilled rev={''} />} onClick={handleUpdateisActive}>
                <Translate contentKey="diningTable.action.allowSell" />
              </Button>
            )}
            <Button type="primary" danger onClick={handleDelete}>
              <DeleteFilled rev={''} />
              <Translate contentKey="entity.action.delete" />
            </Button>
          </div>
        </Tabs.TabPane>
      </Tabs>
      <DiningTableDelete
        diningTables={[diningTable]}
        handleClose={() => setIsShowDialog(false)}
        isOpen={isShowDialog}
        isActive={isActive}
      />
    </>
  );
};

export default DiningTableDetail;
