import React, { useEffect, useState } from 'react';
import { Avatar, Card } from 'antd';
import { DeleteTwoTone, EditTwoTone, HomeTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import {
  getEntities,
  setActiveBankAccountInfo,
  setDefaultBankAccountInfo,
} from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant.reducer';
import { IBankAccountInfo } from 'app/shared/model/bank-account-info';
import { CheckBankAccountTenantForm } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant-form';

export const CheckBankAccountTenant = () => {
  const dispatch = useAppDispatch();
  const bankAccountList = useAppSelector(state => state.bankAccount.entities);
  const defaultBank = bankAccountList?.find(bank => bank.default);
  const [isShowForm, setIsShowForm] = useState(false);
  const [updateBankAccountInfo, setUpdateBankAccountInfo] = useState<IBankAccountInfo>();
  const [bankAccountDefault, setBankAccountDefault] = useState();

  useEffect(() => {
    dispatch(getEntities());
    console.log(dispatch(getEntities()));
  }, []);

  const splitIntoRows = (array, rowSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += rowSize) {
      result.push(array.slice(i, i + rowSize));
    }
    return result;
  };

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

      <div className="flex flex-wrap">
        <div className="w-4/5 p-4">
          <p className="font-medium">Bank Accounts</p>
          <div className="flex ">
            {defaultBank ? (
              <Card className="w-1/4 flex justify-center items-center h-36 bankAccountDefault">
                <Meta
                  className="text-white"
                  avatar={<Avatar className="w-full" shape="square" src={defaultBank?.logoBank} />}
                  title={defaultBank?.bankName}
                  description={defaultBank?.accountNumber}
                />
              </Card>
            ) : (
              <Card className="w-1/4 flex justify-center items-center h-36 bankAccountDefault">
                <Meta
                  className="text-white"
                  avatar={
                    <Avatar
                      className="w-full"
                      shape="square"
                      src="https://www.clipartkey.com/mpngs/m/305-3050174_merchant-account-filled-icon-bank-account-icon-png.png"
                    />
                  }
                  title="XXX"
                  description="XX-XXXXX"
                />
              </Card>
            )}

            <Card className="w-1/4 flex justify-center items-center h-36 pr-1 ml-2 cursor-pointer" onClick={() => setIsShowForm(true)}>
              <div className="flex justify-center">
                <PlusCircleTwoTone rev={undefined} />
              </div>
              <p>{translate('bank.addNewBankAccount')}</p>
            </Card>
          </div>

          {splitIntoRows(bankAccountList, 2).map((row, rowIndex) => (
            <div className="flex mt-2.5" key={rowIndex}>
              {row
                .filter(bank => !bank.default && bank.active)
                .map(bankAccount => (
                  <Card
                    className="hover:shadow-md border-solid border-2 border-indigo-600"
                    key={bankAccount.id}
                    style={{ width: 300, margin: '0 8px 8px 0' }}
                    actions={[
                      <HomeTwoTone key="ellipsis" rev={undefined} onClick={() => dispatch(setDefaultBankAccountInfo(bankAccount.id))} />,
                      <EditTwoTone key="edit" rev={undefined} onClick={() => handleOpen(bankAccount)} />,
                      <DeleteTwoTone key="setting" rev={undefined} onClick={() => dispatch(setActiveBankAccountInfo(bankAccount.id))} />,
                    ]}
                  >
                    <Meta
                      avatar={<Avatar className="w-full" shape="square" src={bankAccount.logoBank} />}
                      title={bankAccount.bankName}
                      description={bankAccount.accountNumber}
                    />
                  </Card>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
