import React from 'react';
import { useAppSelector } from '../../config/store';

export const CurrencyFormat = ({ children }) => {
  const { currencyUnit } = useAppSelector(state => state.restaurant.restaurant);
  const localeKey = currencyUnit === 'VND' ? 'vi-VN' : currencyUnit === 'USD' ? 'en-US' : '';
  return (
    <>
      {localeKey && new Intl.NumberFormat(localeKey, { minimumFractionDigits: localeKey === 'en-US' ? 2 : 0 }).format(parseFloat(children))}
    </>
  );
};
export const currencyFormat = (num, localeKey) => {
  return localeKey
    ? new Intl.NumberFormat(localeKey, { minimumFractionDigits: localeKey === 'en-US' ? 2 : 0 }).format(parseFloat(num))
    : '0';
};
