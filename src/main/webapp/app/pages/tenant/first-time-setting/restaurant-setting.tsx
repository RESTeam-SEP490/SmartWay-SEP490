import { RightCircleFilled } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { restaurantActions, updateRestaurantInfo } from '../restaurant-setting/restaurant.reducer';
import { Navigate, useNavigate } from 'react-router-dom';
import NavigateAfterLogin from 'app/modules/login/navigate-after-login';

export const FirstTimeSetting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const restaurant = useAppSelector(state => state.restaurant.restaurant);
  const updating = useAppSelector(state => state.restaurant.updating);
  const updateSuccess = useAppSelector(state => state.restaurant.updateSuccess);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ ...restaurant, name: restaurant.id, currencyUnit: 'VND' });
  }, [restaurant]);

  const onFinish = values => {
    dispatch(updateRestaurantInfo(values));
  };

  if (Object.keys(restaurant).length > 0 && !restaurant.isNew) {
    dispatch(restaurantActions.setIsShowSubsciptionModal(true));
    return <NavigateAfterLogin />;
  }
  return (
    <>
      <div className="flex">
        <div className="hidden w-1/2 min-h-screen p-6 lg:block">
          <div className="relative w-full h-full">
            <div className="absolute top-0 bottom-0 w-full rounded-lg bg-center bg-cover bg-wall-primary bg-[url('content/images/wall.jpeg')]"></div>
            <div className="absolute top-0 bottom-0 w-full rounded-lg bg-gradient-to-l from-40 to-90 from-blue-600/60 to-blue-300/60"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-1/2">
          <BrandIcon />
          <Typography.Title className="!mb-1 text-blue mt-4" level={2}>
            Restaurant information
            {/* <Translate contentKey="register.title"></Translate> */}
          </Typography.Title>
          <Typography.Text className="text-gray-500">
            <Translate contentKey="register.subtitle"></Translate>
          </Typography.Text>
          <Form
            requiredMark={false}
            onFinish={onFinish}
            layout="vertical"
            form={form}
            size="large"
            labelAlign="left"
            className="min-w-[60%] mt-8"
          >
            <Form.Item
              rules={[{ required: true, message: translate('entity.validation.required') }]}
              name={'name'}
              className="!my-2"
              label={'Restaurant name'}
            >
              <Input />
            </Form.Item>
            <Row>
              <Col className="w-3/4 pr-2">
                <Form.Item
                  rules={[{ required: true, message: translate('entity.validation.required') }]}
                  name={'phone'}
                  className="!my-2"
                  label={'Phone number'}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col className="w-1/4 pl-2">
                <Form.Item
                  rules={[{ required: true, message: translate('entity.validation.required') }]}
                  name={'currencyUnit'}
                  className="!my-2"
                  label={'Currency'}
                  initialValue={'VND'}
                >
                  <Select>
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="VND">VND</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              rules={[{ required: true, message: translate('entity.validation.required') }]}
              name={'address'}
              className="!my-2"
              label={'Restaurant address'}
            >
              <Input />
            </Form.Item>
            <Form.Item className="!mb-2 !mt-8">
              <Button size="large" loading={updating} htmlType="submit" type="link" className={'float-right'}>
                Countinue
                <RightCircleFilled rev={''} />
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default FirstTimeSetting;
