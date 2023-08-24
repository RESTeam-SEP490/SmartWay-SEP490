import React, { useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { Button, Form, Input, Tabs, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch } from 'app/config/store';
import { CheckSquareFilled, LockFilled } from '@ant-design/icons';
import { IRestaurantWithAdmin } from 'app/shared/model/restaurant-with-admin.model';
import RestaurantWithAdminActive from './restaurant-dialog';

export const RestaurantWithAdminDetail = ({
  restaurantWithAdmin,
  onUpdate,
}: {
  restaurantWithAdmin: IRestaurantWithAdmin;
  onUpdate: any;
}) => {
  const dispatch = useAppDispatch();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isActive, setIsActive] = useState<boolean>();

  const handleUpdateIsActive = () => {
    setIsActive(!restaurantWithAdmin.isActive);
    setIsShowDialog(true);
  };
  return (
    <>
      <Tabs defaultValue={1}>
        <Tabs.TabPane tab={translate('restaurant.information')} key={1} className="p-4 details max-w-[calc((100vw-32px)*4/5-66px)]">
          <div className="">
            <Typography.Title level={4}>{restaurantWithAdmin.id}</Typography.Title>
          </div>

          <div className="flex">
            <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon className="flex-grow ml-6">
              <Form.Item className="!mb-0" label={translate('restaurant.id')}>
                <Input bordered={false} value={restaurantWithAdmin.id} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.name')}>
                <Input bordered={false} value={restaurantWithAdmin.name} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.currencyUnit')}>
                <Input bordered={false} value={restaurantWithAdmin.currencyUnit} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.phone')}>
                <Input bordered={false} value={restaurantWithAdmin.phone} readOnly={true} />
              </Form.Item>
              <Form.Item className="!mb-0" label={translate('restaurant.planExpiry')}>
                <Input bordered={false} value={restaurantWithAdmin.planExpiry.toString()} />
              </Form.Item>
            </Form>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {restaurantWithAdmin.isActive ? (
              <Button danger type="primary" icon={<LockFilled rev={''} />} onClick={handleUpdateIsActive}>
                <Translate contentKey="menuItem.action.stopSell" />
              </Button>
            ) : (
              <Button type="primary" icon={<CheckSquareFilled rev={''} />} onClick={handleUpdateIsActive}>
                <Translate contentKey="menuItem.action.allowSell" />
              </Button>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
      <RestaurantWithAdminActive
        restaurantWithAdmin={[restaurantWithAdmin]}
        isOpen={isShowDialog}
        handleClose={() => setIsShowDialog(false)}
        isActive={isActive}
      />
    </>
  );
};

export default RestaurantWithAdminDetail;
