import React from 'react';
import { useAppSelector } from '../../config/store';

export const CurrencyFormat = ({ children }) => {
  const { currencyUnit } = useAppSelector(state => state.restaurant.restaurant);
  const localeKey = currencyUnit === 'VND' ? 'vi-VN' : currencyUnit === 'USD' ? 'en-US' : '';
  return <>{localeKey && new Intl.NumberFormat(localeKey).format(parseFloat(children))}</>;
};
export const currencyFormat = (num, locale) => {
  return locale ? new Intl.NumberFormat(locale).format(parseFloat(num)) : '0';
};
