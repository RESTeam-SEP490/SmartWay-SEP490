import { CreditCardOutlined, PercentageOutlined, PrinterFilled, TagsFilled } from '@ant-design/icons';
import { Button, ConfigProvider, Drawer, Form, Image, Input, InputNumber, Modal, Popover, Radio, Select } from 'antd';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IBankAccountInfo } from 'app/shared/model/bank-account-info';
import { IOrder } from 'app/shared/model/order/order.model';
import { currencyFormat } from 'app/shared/util/currency-utils';
import React, { useCallback, useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { checkOut, printBill } from '../order.reducer';
import ReturnItemsModal from './modals/return-items-modal';

export const Charge = ({ isOpen, handleClose }: { isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const updating = useAppSelector(state => state.order.updating);
  const updateSuccess = useAppSelector(state => state.order.updateSuccess);
  const bankAccountInfoList = useAppSelector(state => state.bankAccount.entities);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const [billDetail, setBillDetail] = useState({ totalQuantity: 0, subtotal: 0 });

  const [isShowBankSelect, setIsShowBankSelect] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isShowDiscountPopover, setIsShowDiscountPopover] = useState(false);
  const [returnList, setReturnList] = useState([]);

  const [discount, setDiscount] = useState<{ number: number; isByPercent: boolean }>({ number: 0, isByPercent: false });
  const [selectedAccount, setSelectedAccount] = useState<IBankAccountInfo>({});
  const restaurant = useAppSelector(state => state.restaurant.restaurant);
  const { currencyUnit } = restaurant;
  const localeKey = currencyUnit === 'VND' ? 'vi-VN' : currencyUnit === 'USD' ? 'en-US' : '';

  useEffect(() => {
    const defaultBankInfo = bankAccountInfoList.find(info => info.default);
    if (defaultBankInfo) {
      form.setFieldValue('bankAccountInfo', defaultBankInfo.id);
      setSelectedAccount(defaultBankInfo);
    }
  }, [bankAccountInfoList]);

  useEffect(() => {
    handleClose();
    setIsOpenConfirmModal(false);
  }, [updateSuccess]);

  const changeSelectAccountInfo = value => {
    setSelectedAccount(bankAccountInfoList.find(info => info.id === value));
  };

  const onCheckout = (isFreeUpTable: boolean) => {
    const values = form.getFieldsValue();
    dispatch(checkOut({ ...values, orderId: currentOrder.id, freeUpTable: isFreeUpTable }));
  };

  const onPrintBill = () => {
    dispatch(printBill({ orderId: currentOrder.id, returnItemList: returnList, discount: discount.number }));
  };

  return (
    <>
      <Drawer
        open={isOpen}
        className="flex rounded-l-lg"
        title={translate('order.charge.label')}
        closable={true}
        onClose={() => handleClose(false)}
        width={900}
      >
        <div className="flex flex-col w-2/3 pr-4 border-r border-r-slate-100">
          <ReturnItemsModal setBillDetail={setBillDetail} setReturnList={setReturnList} />
        </div>
        <div className="flex flex-col justify-between w-1/3 h-full pt-8 pl-2">
          <div className="">
            <Form
              name="billForm"
              form={form}
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              labelAlign="left"
              className="label-font-normal"
            >
              <Form.Item label={translate('order.charge.quantity')} className="!mb-2">
                <Input className="text-right " bordered={false} readOnly value={billDetail.totalQuantity} />
              </Form.Item>
              <Form.Item label={translate('order.charge.subtotal')} className="!mb-2">
                <Input className="text-right " bordered={false} readOnly value={currencyFormat(billDetail.subtotal, localeKey)} />
              </Form.Item>
              <Popover
                placement="top"
                content={
                  <DiscountPopover
                    isOpen={isShowDiscountPopover}
                    subtotal={billDetail.subtotal}
                    discount={discount}
                    setDiscount={setDiscount}
                    onClose={() => setIsShowDiscountPopover(false)}
                  />
                }
                trigger="click"
                onOpenChange={open => setIsShowDiscountPopover(open)}
                open={isShowDiscountPopover}
              >
                <Form.Item
                  label={`${translate('order.charge.discount')}${discount.isByPercent ? ` (${discount.number}%)` : ''}`}
                  className="!mb-2 cursor-pointer"
                >
                  <Input
                    value={currencyFormat(discount.number, localeKey)}
                    bordered={false}
                    readOnly
                    className="w-full discount pr-7 !cursor-pointer"
                    suffix={<TagsFilled className="!text-blue-400" rev="" />}
                  />
                </Form.Item>
              </Popover>
              <Form.Item label={translate('order.orderDetails.total')} className="!mb-2 bg-blue-100 rounded-md label-font-semibol">
                <Input
                  className="text-lg font-semibold text-right text-blue-600"
                  bordered={false}
                  readOnly
                  value={
                    currencyFormat(
                      billDetail.subtotal - (discount.isByPercent ? (billDetail.subtotal * discount.number) / 100 : discount.number),
                      localeKey
                    ) +
                    ' ' +
                    restaurant.currencyUnit
                  }
                />
              </Form.Item>
              <Form.Item name={'isPayByCash'} initialValue={true}>
                <Radio.Group className="flex" onChange={e => setIsShowBankSelect(!e.target.value)}>
                  <Radio value={true}>Cash</Radio>
                  <Radio value={false}>Banking</Radio>
                </Radio.Group>
              </Form.Item>
              {isShowBankSelect && (
                <>
                  <Form.Item label={''} name={'bankAccountInfoId'} wrapperCol={{ span: 26 }}>
                    <Select className="!w-full" onChange={changeSelectAccountInfo}>
                      {bankAccountInfoList.map((info: IBankAccountInfo) => (
                        <Select.Option key={info.id} value={info.id}>
                          {info.bankName + ' - ' + info.accountNumber}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className="flex justify-center">
                    <Image
                      className="!w-40"
                      src={`https://img.vietqr.io/image/${selectedAccount.bin}-${selectedAccount.accountNumber}-compact.png?amount=${
                        billDetail.subtotal - (discount.isByPercent ? (billDetail.subtotal * discount.number) / 100 : discount.number)
                      }&addInfo=${currentOrder.code}-${restaurant.name}`}
                    />
                  </div>
                </>
              )}
            </Form>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: colors.green[600],
                colorPrimaryHover: colors.green[500],
                colorPrimaryActive: colors.green[700],
              },
            }}
          >
            <div className="flex items-center justify-end gap-4">
              <Button size="large" type="primary" className="w-40" ghost icon={<PrinterFilled rev="" />} onClick={onPrintBill}>
                Print bill
              </Button>
              <Button
                size="large"
                type="primary"
                className="w-40"
                icon={<CreditCardOutlined rev="" />}
                onClick={() => setIsOpenConfirmModal(true)}
              >
                Check out
              </Button>
            </div>
          </ConfigProvider>
        </div>
      </Drawer>
      <Modal
        centered
        open={isOpenConfirmModal}
        destroyOnClose
        width={500}
        onOk={() => onCheckout(true)}
        onCancel={() => setIsOpenConfirmModal(false)}
        footer={[]}
        closeIcon={<></>}
      >
        <span className="text-[1rem]">Do you want to check out and free up tables?</span>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="primary" onClick={() => onCheckout(true)}>
            Yes
          </Button>
          <Button onClick={() => onCheckout(false)}>No, check out only</Button>
        </div>
      </Modal>
    </>
  );
};

const DiscountPopover = ({
  discount,
  isOpen,
  setDiscount,
  subtotal,
  onClose,
}: {
  discount: any;
  setDiscount: any;
  onClose: any;
  isOpen: boolean;
  subtotal: number;
}) => {
  const restaurant = useAppSelector(state => state.restaurant.restaurant);
  const { currencyUnit } = restaurant;
  const localeKey = currencyUnit === 'VND' ? 'vi-VN' : currencyUnit === 'USD' ? 'en-US' : '';
  const [form] = Form.useForm();

  const [isByPercent, setIsByPercent] = useState(discount.isByPercent);
  const [isInvalidNumber, setIsInvalidNumber] = useState(false);

  const inputRef = useCallback(
    inputElement => {
      if (inputElement) {
        if (!form.isFieldsTouched()) {
          setTimeout(() => {
            inputElement.focus();
            inputElement.select();
          }, 200);
        }
        if (isInvalidNumber) {
          inputElement.select();
        }
      }
    },
    [isOpen, isInvalidNumber]
  );

  const onchange = () => {
    const nextIsByPercent = form.getFieldValue('isByPercent');

    if (form.getFieldValue('number') > (nextIsByPercent ? 100 : subtotal)) {
      form.setFieldValue('number', nextIsByPercent ? '100' : subtotal);
      setTimeout(() => setIsInvalidNumber(true), 50);
    } else {
      setIsInvalidNumber(false);
    }
    if (form.getFieldValue('number') <= 0) {
      form.setFieldValue('number', '0');
    }
    setDiscount({ ...form.getFieldsValue() });
    setIsByPercent(nextIsByPercent);
  };

  return (
    <>
      <Form
        name="discountForm"
        form={form}
        onFinish={() => {
          onchange();
          onClose();
        }}
        onChange={onchange}
        className="flex gap-2 grow w-80"
      >
        <Form.Item
          name={'number'}
          initialValue={discount.isByPercent ? discount.number / subtotal : discount.number}
          wrapperCol={{ span: 26 }}
          className="grow !m-0"
        >
          <InputNumber
            ref={inputRef}
            className="!text-right w-full"
            controls={false}
            parser={val => {
              try {
                // for when the input gets clears
                if (typeof val === 'string' && !val.length) {
                  val = '0.0';
                }

                // detecting and parsing between comma and dot
                const group = new Intl.NumberFormat(localeKey).format(1111).replace(/1/g, '');
                const decimal = new Intl.NumberFormat(localeKey).format(1.1).replace(/1/g, '');
                let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
                reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
                //  => 1232.21 €

                // removing everything except the digits and dot
                reversedVal = reversedVal.replace(/[^0-9.]/g, '');
                //  => 1232.21

                // appending digits properly
                const digitsAfterDecimalCount = (reversedVal.split('.')[1] || []).length;
                const needsDigitsAppended = digitsAfterDecimalCount > 2;
                let result;
                if (needsDigitsAppended) {
                  result = parseFloat(reversedVal) * Math.pow(10, digitsAfterDecimalCount - 2);
                }

                return Number.isNaN(result) ? 0 : reversedVal;
              } catch (error) {
                console.error(error);
              }
              return 0;
            }}
            formatter={x => currencyFormat(x, localeKey)}
          />
        </Form.Item>
        <Form.Item name={'isByPercent'} initialValue={isByPercent} wrapperCol={{ span: 26 }} className="grow !m-0">
          <Radio.Group buttonStyle="solid" onChange={value => setIsByPercent(value)}>
            <Radio.Button value={false}>
              <span className="font-semibold">{restaurant.currencyUnit}</span>
            </Radio.Button>
            <Radio.Button value={true}>
              <PercentageOutlined rev={''} />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
};
