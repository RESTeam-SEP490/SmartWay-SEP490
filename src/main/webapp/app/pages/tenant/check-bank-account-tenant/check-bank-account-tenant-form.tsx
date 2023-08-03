import React, { useState, useEffect } from 'react';
import { Container, FormGroup, FormText } from 'reactstrap';
import { Button, Form, Input, Modal, Select } from 'antd';
import axios from 'axios';
import { Translate, translate } from 'react-jhipster';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IBankAccountInfo } from 'app/shared/model/bank-account-info';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';

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

  const [bankList, setBankList] = useState([]);
  const url = 'https://api.vietqr.io/v2/banks';

  useEffect(() => {
    fetchBankList();
  }, []);

  useEffect(() => {
    if (!isNew) {
      form.setFieldsValue({ ...bankAccount });
    } else {
      form.resetFields();
    }
  }, [isNew]);

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

  return (
    <>
      <Modal
        open={isOpen}
        destroyOnClose
        centered
        width={500}
        title={
          <Translate
            contentKey={isNew ? 'bank.createBankAccount' : 'bank.updateBankAccount'}
            interpolate={{ entity: translate('global.menu.entities.staff').toLowerCase() }}
          />
        }
        footer={[]}
        onCancel={() => handleClose()}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} colon>
          <FormGroup>
            <div>
              <Form.Item label={translate('bank.bankName')}>
                <Select placeholder={translate('bank.selectBank')}>
                  {bankList.map(bank => (
                    <Select.Option key={bank.bin} value={bank.bin}>
                      ({bank.bin}) {bank.shortName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              <div>
                <Form.Item label={translate('bank.accountNumber')}>
                  <Input />
                </Form.Item>
              </div>
              <SubmitButton form={form} isNew={isNew} updating={updating}></SubmitButton>
            </div>
          </FormGroup>
        </Form>
      </Modal>
    </>
  );
};
