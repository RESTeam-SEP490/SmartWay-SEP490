import { Button, Modal, Radio, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { BrandIcon } from 'app/shared/layout/header/header-components';
import { IRestaurant } from 'app/shared/model/restaurant.model';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currencyFormat } from '../../../shared/util/currency-utils';
import { getCheckoutUrl, restaurantActions } from './restaurant.reducer';

export const Subscription = () => {
  const dispatch = useAppDispatch();
  const username = useAppSelector(state => state.authentication.account.username);
  const restaurant: IRestaurant = useAppSelector(state => state.restaurant.restaurant);
  const isShowSubsciptionModal = useAppSelector(state => state.restaurant.isShowSubsciptionModal);
  const updating = useAppSelector(state => state.restaurant.updating);
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState('YEARLY');

  return (
    <Modal closable={false} open={isShowSubsciptionModal} centered footer={[]} className=" !w-auto !h-auto rounded-lg ">
      <div
        hidden={!updating}
        className="fixed transition-opacity duration-1000 bg-white bg-opacity-70 top-0 bottom-0 left-0 right-0 z-[5000]"
      >
        <div className="app-loading">
          <div className="image-loading"></div>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col ">
        <div className="p-8 flex rounded-lg bg-gradient-to-br from-5% to-50% from-blue-600/50 to-blue-50  mx-auto flex-col items-center justify-center h-full">
          <div className="m-6">
            <BrandIcon />
          </div>
          {restaurant.planExpiry && dayjs(restaurant.planExpiry).isBefore(dayjs()) && (
            <Typography.Title level={5} className="leading-none !m-0 !text-red-600">
              YOUR PLAN EXPIRED ON {dayjs(restaurant.planExpiry).format('LL').toLocaleUpperCase()}
            </Typography.Title>
          )}
          <Typography.Title level={2} className="leading-none !m-0">
            Select plan for your restaurant
          </Typography.Title>
          <div className="flex gap-8 p-8">
            <div
              onClick={() => setSelectedPlan('YEARLY')}
              className={`flex w-64 cursor-pointer flex-col items-center gap-4 p-6 pt-4 bg-white border-2 border-gray-200 rounded-lg ${
                selectedPlan === 'YEARLY' ? '!border-blue-400 shadow-lg shadow-blue-300/50' : ''
              }`}
            >
              <Radio checked={selectedPlan === 'YEARLY'} />
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold ">Anual plan</span>
              </div>
              <div className="flex flex-col items-center pt-4">
                <div className="text-xl text-gray-500 line-through ">{currencyFormat(1188000, 'vi-VN')}</div>
                <div className="flex items-center gap-2 text-4xl font-semibold !leading-none">
                  {currencyFormat(899000, 'vi-VN')}
                  <div className="flex flex-col">
                    <div className="text-lg">VND</div>
                    <div className="text-sm font-normal text-gray-400">/year</div>
                  </div>
                </div>
              </div>
              <span className="text-base font-semibold text-green-600">Save 25%</span>
            </div>
            <div
              onClick={() => setSelectedPlan('PER_6_MONTHS')}
              className={`flex w-64 cursor-pointer flex-col items-center gap-4 p-6 pt-4 bg-white border-2 border-gray-200 rounded-lg ${
                selectedPlan === 'PER_6_MONTHS' ? '!border-blue-400 shadow-lg shadow-blue-300/50' : ''
              }`}
            >
              <Radio checked={selectedPlan === 'PER_6_MONTHS'} />

              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold ">Semi-anual plan</span>
              </div>
              <div className="flex flex-col items-center pt-4">
                <div className="text-xl text-gray-500 line-through ">{currencyFormat(594000, 'vi-VN')}</div>
                <div className="flex items-center gap-2 text-4xl font-semibold !leading-none">
                  {currencyFormat(499000, 'vi-VN')}
                  <div className="flex flex-col">
                    <div className="text-lg">VND</div>
                    <div className="text-sm font-normal text-gray-400">/6 months</div>
                  </div>
                </div>
              </div>
              <span className="text-base font-semibold text-yellow-600">Save 15%</span>
            </div>
            <div
              onClick={() => setSelectedPlan('MONTHLY')}
              className={`flex w-64 cursor-pointer flex-col items-center gap-4 p-6 pt-4 bg-white border-2 border-gray-200 rounded-lg ${
                selectedPlan === 'MONTHLY' ? '!border-blue-400 shadow-lg shadow-blue-300/50' : ''
              }`}
            >
              <Radio checked={selectedPlan === 'MONTHLY'} />
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold ">Monthly plan</span>
              </div>
              <div className="flex flex-col items-center pt-10">
                <div className="flex items-center gap-2 text-4xl font-semibold !leading-none">
                  {currencyFormat(99000, 'vi-VN')}
                  <div className="flex flex-col">
                    <div className="text-lg">VND</div>
                    <div className="text-sm font-normal text-gray-400">/month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              type="primary"
              size="large"
              className="w-60"
              onClick={() => {
                dispatch(getCheckoutUrl(selectedPlan));
              }}
            >
              Check out
            </Button>
            {!restaurant.stripeSubscriptionId && !dayjs(restaurant.planExpiry).isBefore(dayjs()) && (
              <Button
                type="primary"
                ghost
                size="large"
                className="w-60"
                onClick={() => {
                  dispatch(restaurantActions.setIsShowSubsciptionModal(false));
                }}
              >
                Continue with trial
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default Subscription;
