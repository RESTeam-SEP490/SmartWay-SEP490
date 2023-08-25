import { EditOutlined, ShopFilled } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { CheckBankAccountTenant } from '../check-bank-account-tenant/check-bank-account-tenant';
import { getPortalUrl, restaurantActions, updateRestaurantInfo } from './restaurant.reducer';
import { useNavigate } from 'react-router-dom';
import { translate } from 'react-jhipster';

export const RestaurantSetting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const restaurant: IRestaurant = useAppSelector(state => state.restaurant.restaurant);
  const [form] = Form.useForm();
  const [isEditRestaurant, setIsEditRestaurant] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ ...restaurant });
  }, [restaurant]);

  const buttonIsActive = () => {
    if (isEditRestaurant) {
      setIsEditRestaurant(false);
    } else {
      setIsEditRestaurant(true);
    }
  };

  const cancelUpdateRestaurantInfo = () => {
    setIsEditRestaurant(false);
    form.setFieldsValue({ ...restaurant });
  };

  const saveRestaurantInfo = values => {
    const entity = {
      ...restaurant,
      ...values,
    };
    dispatch(updateRestaurantInfo(entity));
    setIsEditRestaurant(false);
  };

  return (
    <>
      <div className="max-w-5xl lg:min-w-[800px] mx-auto mt-10">
        <div className="flex justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-32 h-32 bg-blue-600 rounded-lg">
              <ShopFilled rev={''} className="text-5xl text-white" />
            </div>
            <div className="flex flex-col">
              <div className="">
                <Typography.Title level={3} className="!mb-0 !leading-none">
                  {restaurant.name}
                </Typography.Title>
                <div className="mt-2 text-base leading-none text-gray-600">{restaurant.id}.smart-way.website</div>
              </div>
              <div className={`my-4 text-sm leading-none  ${restaurant.stripeSubscriptionId ? 'text-green-600' : 'text-blue-500'}`}>
                {restaurant.stripeSubscriptionId ? 'Subscription' : 'Trial'} is active util{' '}
                <span className="font-semibold">{dayjs(restaurant.planExpiry).format('LL')}</span>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            ghost
            onClick={() => {
              if (restaurant.stripeSubscriptionId) dispatch(getPortalUrl());
              else dispatch(restaurantActions.setIsShowSubsciptionModal(true));
            }}
          >
            Subscription Portal
          </Button>
        </div>
        <div className="mt-8 border-0 border-t border-solid border-slate-200"></div>
        <div className="p-2 ">
          <div className="flex items-center justify-between gap-4">
            <Typography.Title level={5} className="!text-blue-600">
              Restaurant Information
            </Typography.Title>
            <Button shape="circle" type="primary" icon={<EditOutlined rev={''} />} onClick={buttonIsActive}></Button>
          </div>
          <div className="max-w-lg mt-4 ml-4">
            {isEditRestaurant ? (
              <>
                <Form form={form} labelAlign="left" {...DEFAULT_FORM_ITEM_LAYOUT} onFinish={saveRestaurantInfo}>
                  <Form.Item
                    name={'name'}
                    className="!my-2"
                    label={'Restaurant name'}
                    rules={[{ required: true, message: translate('entity.validation.required') }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={'phone'}
                    className="!my-2"
                    label={'Phone number'}
                    rules={[{ required: true, message: translate('entity.validation.required') }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={'address'}
                    className="!my-2"
                    label={'Address'}
                    rules={[{ required: true, message: translate('entity.validation.required') }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name={'currencyUnit'} className="!my-2" label={'Currency'}>
                    <Input bordered={false} readOnly />
                  </Form.Item>
                  <Button type="primary" className="float-right" htmlType="submit">
                    {translate('entity.action.save')}
                  </Button>
                  <Button type="primary" ghost className="float-right mr-2" htmlType="button" onClick={cancelUpdateRestaurantInfo}>
                    {translate('entity.action.cancel')}
                  </Button>
                </Form>
                <div className="mt-12 border-0 border-t border-solid border-slate-200"></div>
              </>
            ) : (
              <>
                <Form form={form} labelAlign="left" {...DEFAULT_FORM_ITEM_LAYOUT}>
                  <Form.Item name={'name'} className="!my-2" label={'Restaurant name'}>
                    <Input bordered={false} readOnly />
                  </Form.Item>
                  <Form.Item name={'phone'} className="!my-2" label={'Phone number'}>
                    <Input bordered={false} readOnly />
                  </Form.Item>
                  <Form.Item name={'address'} className="!my-2" label={'Address'}>
                    <Input bordered={false} readOnly />
                  </Form.Item>
                  <Form.Item name={'currencyUnit'} className="!my-2" label={'Currency'}>
                    <Input bordered={false} readOnly />
                  </Form.Item>
                </Form>
                <div className="mt-8 border-0 border-t border-solid border-slate-200"></div>
              </>
            )}
          </div>
          <div className="p-2">
            <CheckBankAccountTenant />
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantSetting;
