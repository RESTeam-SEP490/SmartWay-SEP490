import React from 'react';
import { useAppSelector } from '../../config/store';

export const CurrencyFormat = ({ children }) => {
  const { currencyUnit } = useAppSelector(state => state.restaurant.restaurant);
  const localeKey = currencyUnit === 'VND' ? 'vi-VN' : currencyUnit === 'USD' ? 'en-US' : '';
  console.log(localeKey, currencyUnit);
  return <span>{localeKey && new Intl.NumberFormat(localeKey).format(parseFloat(children))}</span>;
};
