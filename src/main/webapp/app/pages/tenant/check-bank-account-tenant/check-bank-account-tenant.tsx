import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Image, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { CheckBankAccountTenantForm } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant-form';
import { getEntities } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant.reducer';
import { IBankAccountInfo } from 'app/shared/model/bank-account-info';
import React, { useEffect, useState } from 'react';

export const CheckBankAccountTenant = () => {
  const dispatch = useAppDispatch();
  const bankAccountList = useAppSelector(state => state.bankAccount.entities);
  const [isShowForm, setIsShowForm] = useState(false);
  const [updateBankAccountInfo, setUpdateBankAccountInfo] = useState<IBankAccountInfo>();

  useEffect(() => {
    dispatch(getEntities());
  }, []);

  const handleOpen = (bankAccountInfo: IBankAccountInfo) => {
    setUpdateBankAccountInfo(bankAccountInfo);
    setIsShowForm(true);
  };

  const handleClose = () => {
    setUpdateBankAccountInfo(undefined);
    setIsShowForm(false);
  };

  return (
    <>
      <CheckBankAccountTenantForm bankAccount={updateBankAccountInfo} isOpen={isShowForm} handleClose={handleClose} />
      <div className="flex items-center justify-between gap-4">
        <Typography.Title level={5} className="!text-blue-600">
          Bank account
        </Typography.Title>
        <Button shape="circle" type="primary" icon={<PlusOutlined rev={''} />} onClick={() => setIsShowForm(true)}></Button>
      </div>
      <div className="max-w-lg mt-4 ml-2">
        <div className="flex flex-col">
          {bankAccountList?.map((account: IBankAccountInfo) => (
            <div key={account.id} className="flex items-center justify-between gap-2 px-4 py-2">
              <div className="flex gap-2">
                <Image preview={false} className="!w-14 object-contain" src={account?.logoBank} />
                <span className="text-gray-500">{account.bankName + ' - ' + account?.accountNumber}</span>
              </div>
              <Button type="text" className="text-gray-400" icon={<EditFilled rev={''} />} onClick={() => handleOpen(account)}></Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
