import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
import axios from 'axios';
import { Translate, translate } from 'react-jhipster';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IBankAccountInfo } from 'app/shared/model/bank-account-info';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { createEntity, updateEntity } from 'app/pages/tenant/check-bank-account-tenant/check-bank-account-tenant.reducer';
import { SaveOutlined } from '@ant-design/icons';

export const CheckBankAccountTenantForm = ({
  bankAccount,
  isOpen,
  handleClose,
}: {
  bankAccount?: IBankAccountInfo;
  isOpen: boolean;
  handleClose: any;
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isNew = bankAccount?.id == undefined;
  const updating = useAppSelector(state => state.bankAccount.updating);
  const updateSuccess = useAppSelector(state => state.bankAccount.updateSuccess);
  const [isValidAccount, setIsValidAccount] = useState(false);
  const [bankList, setBankList] = useState([]);
  const url = 'https://api.vietqr.io/v2/banks';

  useEffect(() => {
    fetchBankList();
  }, []);

  useEffect(() => {
    if (!isNew) {
      const selectedBank = bankList.find(bank => bank.bin === bankAccount.bin);
      if (selectedBank) form.setFieldValue('bank', JSON.stringify(selectedBank));
      form.setFieldsValue({ ...bankAccount });
    } else {
      form.resetFields();
    }
  }, [isNew, isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      form.resetFields();
      handleClose();
    }
  }, [updateSuccess]);

  const fetchBankList = () => {
    axios
      .get(url)
      .then(response => {
        if (Array.isArray(response.data.data)) {
          setBankList(response.data.data);
        } else {
          console.error('Invalid response data: ', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching bank list:', error);
      });
  };

  const saveEntity = async values => {
    if (isValidAccount) {
      const entity = {
        ...bankAccount,
        ...values,
        bankName: JSON.parse(values.bank).short_name,
        bin: JSON.parse(values.bank).bin,
        logoBank: JSON.parse(values.bank).logo,
      };

      if (isNew) {
        dispatch(createEntity(entity));
      } else {
        dispatch(updateEntity(entity));
      }
    }
  };

  const handelOnblur = () => {
    let axios = require('axios');
    const bank = JSON.parse(form.getFieldValue('bank'));
    const data = JSON.stringify({
      bin: bank?.bin || '',
      accountNumber: form.getFieldValue('accountNumber') || '',
    });

    let config = {
      method: 'post',
      url: 'https://api.vietqr.io/v2/lookup',
      headers: {
        'x-client-id': '0ccc4c53-c312-49ee-bdf8-f95b36c59f44',
        'x-api-key': '79135d04-2ec8-4d0b-92b3-a07e047c3acf',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        if (response.data.desc == 'Account number Invalid - Số tài khoản không hợp lệ') {
          form.setFields([{ name: 'accountNumber', errors: [translate('bank.AccountNumberInValid')] }]);
          form.setFieldValue('fullNameBankAccount', '');
        }
        if (response.data.desc == 'Bank not support - Ngân hàng không hỗ trợ') {
          form.setFields([{ name: 'accountNumber', errors: [translate('bank.BankNotSupport')] }]);
          form.setFieldValue('fullNameBankAccount', '');
        }
        if (response.data.desc == 'Oops, Something went wrong - Lỗi không xác định') {
          form.setFields([{ name: 'accountNumber', errors: [translate('bank.Something')] }]);
          form.setFieldValue('fullNameBankAccount', '');
        }
        if (response.data.desc == 'All provider busy - Tất cả các API Provider đều đang bận.') {
          form.setFields([{ name: 'accountNumber', errors: [translate('bank.Busy')] }]);
          form.setFieldValue('fullNameBankAccount', '');
        }
        if (response.data.desc == 'Missing param') {
          form.setFields([{ name: 'accountNumber', errors: [translate('bank.missing')] }]);
          form.setFieldValue('fullNameBankAccount', '');
        }
        if (
          response.data.desc ==
          'Invalid acqId - Mã định danh ngân hàng (thường gọi là BIN) 6 chữ số, quy đinh bởi ngân hàng nước. Xem BIN tại https://api.vietqr.io/v2/banks'
        ) {
          form.setFields([{ name: 'accountNumber', errors: [translate('bank.acqId')] }]);
          form.setFieldValue('fullNameBankAccount', '');
        }
        if (
          response.data.desc ==
          'Invalid accountNo - số tài khoản thụ hưởng nhập số hoặc chữ(alias, nickname), tối thiểu 4 ký tự, tối đa 25 kí tự'
        ) {
          form.setFields([{ name: 'accountNumber', errors: [translate('bank.InvalidAccountNo')] }]);
          form.setFieldValue('fullNameBankAccount', '');
        }
        if (response.data.desc == 'Success - Thành công') {
          form.setFields([{ name: 'accountNumber', errors: [] }]);
          form.setFieldValue('fullNameBankAccount', response.data.data.accountName);
          setIsValidAccount(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        return null;
      });
  };

  return (
    <>
      <Modal
        open={isOpen}
        destroyOnClose
        centered
        width={600}
        title={
          <Translate
            contentKey={isNew ? 'bank.createBankAccount' : 'bank.updateBankAccount'}
            interpolate={{ entity: translate('global.menu.entities.staff').toLowerCase() }}
          />
        }
        footer={[]}
        onCancel={() => handleClose()}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} colon onFinish={saveEntity}>
          <div>
            <Form.Item
              name={'bank'}
              label={translate('bank.bankName')}
              rules={[{ required: true, message: translate('bank.bankNameRequired') }]}
            >
              <Select placeholder={translate('bank.selectBank')} showSearch optionFilterProp={'children'}>
                {bankList.map((bank, index) => (
                  <Select.Option key={index} value={JSON.stringify(bank)}>
                    {`${bank.shortName}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name={'accountNumber'}
              label={translate('bank.accountNumber')}
              rules={[{ required: true, message: translate('bank.accountNumberRequired') }]}
            >
              <Input onBlur={handelOnblur} />
            </Form.Item>
          </div>
          <div>
            <Form.Item name={'fullNameBankAccount'} label={translate('bank.fullNameBankAccount')}>
              <Input readOnly />
            </Form.Item>
          </div>
          {isNew ? (
            <Button icon={<SaveOutlined rev={''} />} type="primary" loading={updating} htmlType="submit" disabled={!isValidAccount}>
              <Translate contentKey={'entity.action.save'} />
            </Button>
          ) : (
            <SubmitButton form={form} isNew={isNew} updating={updating}></SubmitButton>
          )}
        </Form>
      </Modal>
    </>
  );
};
