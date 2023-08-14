import React from 'react';
import BillList from './bill-components/bill-list';
import BillDetails from './bill-components/bill-details';

export const Bill = () => {
  return (
    <div className="flex h-screen">
      <BillList />
      <BillDetails />
    </div>
  );
};

export default Bill;
