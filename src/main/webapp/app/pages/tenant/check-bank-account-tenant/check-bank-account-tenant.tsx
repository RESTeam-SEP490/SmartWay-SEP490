import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card } from 'antd';
import { CheckCircleTwoTone, DeleteTwoTone, EditTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant.reducer';
import { IBankAccountInfo } from 'app/shared/model/bank-account-info';
import { CheckBankAccountTenantForm } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant-form';

export const CheckBankAccountTenant = () => {
  const dispatch = useAppDispatch();
  const bankAccountList = useAppSelector(state => state.bankAccount.entities);
  const [isShowForm, setIsShowForm] = useState(false);
  const [updateBankAccountInfo, setUpdateBankAccountInfo] = useState<IBankAccountInfo>();

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
            <Card
              className="w-1/4 flex justify-center items-center h-36 border-solid border-2 border-indigo-600"
              actions={[<CheckCircleTwoTone twoToneColor="#52c41a" rev={undefined} />]}
            >
              <Meta
                avatar={<Avatar className="w-full" shape="square" src="https://api.vietqr.io/img/ACB.png" />}
                title="TP Bank"
                description="330 8989898989"
              />
            </Card>

            <Card className="w-1/4 flex justify-center items-center h-36 pr-1 ml-2 cursor-pointer" onClick={() => setIsShowForm(true)}>
              <div className="flex justify-center">
                <PlusCircleTwoTone rev={undefined} />
              </div>
              <p>{translate('bank.addNewBankAccount')}</p>
            </Card>
          </div>

          {splitIntoRows(bankAccountList, 3).map((row, rowIndex) => (
            <div className="flex mt-2.5" key={rowIndex}>
              {row.map(bankAccount => (
                <Card
                  className="hover:shadow-md"
                  key={bankAccount.id}
                  style={{ width: 300, margin: '0 8px 8px 0' }}
                  actions={[
                    <CheckCircleTwoTone key="ellipsis" rev={undefined} />,
                    <EditTwoTone key="edit" rev={undefined} />,
                    <DeleteTwoTone key="setting" rev={undefined} />,
                  ]}
                >
                  <Meta
                    avatar={<Avatar className="w-full" shape="square" src="https://api.vietqr.io/img/ACB.png" />}
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
