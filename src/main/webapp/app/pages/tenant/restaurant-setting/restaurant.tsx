import { ShopFilled } from '@ant-design/icons';
import { Form, Input, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { CheckBankAccountTenant } from '../check-bank-account-tenant/check-bank-account-tenant';
import dayjs from 'dayjs';

export const RestaurantSetting = () => {
  const restaurant = useAppSelector(state => state.restaurant.restaurant);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...restaurant });
    console.log(restaurant);
  }, [restaurant]);

  return (
    <>
      <div className="max-w-5xl lg:min-w-[800px] mx-auto mt-10">
        <div className="flex gap-4">
          <div className="flex items-center justify-center w-32 h-32 bg-blue-600 rounded-lg">
            <ShopFilled rev={''} className="text-5xl text-white" />
          </div>
          <div className="">
            <Typography.Title level={3}>
              <Translate contentKey="global.menu.account.restaurant" />
            </Typography.Title>
            <span className="text-gray-500">{restaurant.id}.smart-way.website</span>
          </div>
        </div>
        <div className="mt-8 border-0 border-t border-solid border-slate-200"></div>
        <div className="p-2">
          <Typography.Title level={5} className="!text-blue-600">
            Restaurant Information
          </Typography.Title>
          <div className="max-w-lg mt-4 ml-4">
            <Form form={form} labelAlign="left" {...DEFAULT_FORM_ITEM_LAYOUT}>
              <Form.Item name={'name'} className="!my-2" label={'Restaurant name'}>
                <Input bordered={false} readOnly />
              </Form.Item>
              <Form.Item name={'phone'} className="!my-2" label={'Phone number'}>
                <Input bordered={false} readOnly />
              </Form.Item>
              <Form.Item name={'currencyUnit'} className="!my-2" label={'Currency'}>
                <Input bordered={false} readOnly />
              </Form.Item>
              <Form.Item className="!my-2" label={'Expired date'}>
                <Input bordered={false} readOnly value={dayjs(restaurant.planExpiry).format('DD/MM/YYYY')} />
              </Form.Item>
            </Form>
          </div>
          <div className="mt-8 border-0 border-t border-solid border-slate-200"></div>
          <div className="p-2">
            <CheckBankAccountTenant />
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantSetting;
