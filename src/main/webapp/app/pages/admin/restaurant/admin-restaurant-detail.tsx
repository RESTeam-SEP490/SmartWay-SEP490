import React, { useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { Button, Form, Input, Tabs, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch } from 'app/config/store';
import { IAdminRestaurant } from 'app/shared/model/adminRestaurant';
import { CheckSquareFilled, LockFilled } from '@ant-design/icons';
import AdminRestaurantActive from 'app/pages/admin/restaurant/admin-restaurant-dialog';

export const AdminRestaurantDetail = ({ adminRestaurant, onUpdate }: { adminRestaurant: IAdminRestaurant; onUpdate: any }) => {
  const dispatch = useAppDispatch();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isActive, setIsActive] = useState<boolean>();

  const handleUpdateisActive = () => {
    setIsActive(!adminRestaurant.isActive);
    setIsShowDialog(true);
  };
  return (
    <>
      <Tabs defaultValue={1}>
        <Tabs.TabPane tab={translate('restaurant.information')} key={1} className="p-4 details max-w-[calc((100vw-32px)*4/5-66px)]">
          <div className="">
            <Typography.Title level={4}>{adminRestaurant.id}</Typography.Title>
          </div>

          <div className="flex">
            <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon className="flex-grow ml-6">
              <Form.Item className="!mb-0" label={translate('restaurant.id')}>
                <Input bordered={false} value={adminRestaurant.id} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.name')}>
                <Input bordered={false} value={adminRestaurant.name} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.currencyUnit')}>
                <Input bordered={false} value={adminRestaurant.currencyUnit} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.phone')}>
                <Input bordered={false} value={adminRestaurant.phone} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.planExpiry')}>
                <Input bordered={false} value={adminRestaurant.planExpiry.toString()} />
              </Form.Item>
            </Form>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {adminRestaurant.isActive ? (
              <Button danger type="primary" icon={<LockFilled rev={''} />} onClick={handleUpdateisActive}>
                <Translate contentKey="menuItem.action.stopSell" />
              </Button>
            ) : (
              <Button type="primary" icon={<CheckSquareFilled rev={''} />} onClick={handleUpdateisActive}>
                <Translate contentKey="menuItem.action.allowSell" />
              </Button>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
      <AdminRestaurantActive
        adminRestaurant={[adminRestaurant]}
        handleClose={() => setIsShowDialog(false)}
        isOpen={isShowDialog}
        isActive={isActive}
      />
    </>
  );
};

export default AdminRestaurantDetail;
