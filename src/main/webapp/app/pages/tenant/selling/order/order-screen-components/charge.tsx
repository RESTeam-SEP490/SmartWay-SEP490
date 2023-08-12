import { CreditCardOutlined, PercentageOutlined, PrinterFilled, TagsFilled } from '@ant-design/icons';
import { Button, ConfigProvider, Drawer, Form, Image, Input, InputNumber, Modal, Popover, Radio, Select, Table } from 'antd';
import { alphabetCompare, currencyFormatter } from 'app/app.constant';
import { colors } from 'app/config/ant-design-theme';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IBankAccountInfo } from 'app/shared/model/bank-account-info';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import { IOrder } from 'app/shared/model/order/order.model';
import React, { useCallback, useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Translate, translate } from 'react-jhipster';
import { checkOut, printBill } from '../order.reducer';

export const Charge = ({ isOpen, handleClose }: { isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const updating = useAppSelector(state => state.order.updating);
  const updateSuccess = useAppSelector(state => state.order.updateSuccess);
  const bankAccountInfoList = useAppSelector(state => state.bankAccount.entities);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const [groupedOderDetailList, setGroupedOderDetailList] = useState([]);
  const billDetail = currentOrder.id
    ? {
        totalQuantity: groupedOderDetailList.reduce((totalQuantity, detail) => totalQuantity + detail.quantity, 0),
        subtotal: groupedOderDetailList.reduce((total, detail) => total + detail.quantity * detail.menuItem.sellPrice, 0),
      }
    : { totalQuantity: 0, subtotal: 0 };

  const [isShowBankSelect, setIsShowBankSelect] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isShowDiscountPopover, setIsShowDiscountPopover] = useState(false);
  const [discount, setDiscount] = useState<{ number: number; isByPercent: boolean }>({ number: 0, isByPercent: false });
  const [selectedAccount, setSelectedAccount] = useState<IBankAccountInfo>({});
  const restaurant = useAppSelector(state => state.restaurant.restaurant);
  const orders = useAppSelector(state => state.order.activeOrders);

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

  useEffect(() => {
    const od = currentOrder.orderDetailList.reduce((map, detail) => {
      const { menuItem, note } = detail;
      const group: IOrderDetail[] = map.get(menuItem.name + '._.' + note) ?? [];

      group.push(detail);
      map.set(menuItem.name + '._.' + note, group);

      return map;
    }, new Map<string, IOrderDetail[]>([]));

    const nextGroupedOderDetailList = [];
    od.forEach((value, key) => {
      const detail = {
        ...value[0],
        id: nextGroupedOderDetailList.length + 1,
        quantity: value.reduce((prevQuantity, current) => prevQuantity + current.quantity, 0),
      };
      nextGroupedOderDetailList.push(detail);
    });

    setGroupedOderDetailList(nextGroupedOderDetailList);
  }, [currentOrder]);

  useEffect(() => {
    // if (!isShowDiscountPopover) {
    const { number, isByPercent } = discount;
    form.setFieldValue('discount', isByPercent ? (billDetail.subtotal * number) / 100 : number);
    // }
  }, [discount]);

  const columns = [
    {
      dataIndex: ['menuItem', 'name'],
      key: 'name',
      render: (name, detail) => (
        <div className="flex flex-col">
          {name}
          <span className="text-blue-600">{detail.note}</span>
        </div>
      ),
    },
    {
      dataIndex: ['quantity'],
      key: 'quantity',
    },
    {
      dataIndex: ['menuItem', 'sellPrice'],
      key: 'price',
      render: price => currencyFormatter(price),
    },
    {
      dataIndex: ['quantity'],
      key: 'subTota;',
      render: (quantity, detail) => <span className="font-semibold">{currencyFormatter(quantity * detail.menuItem.sellPrice)}</span>,
    },
  ];

  const changeSelectAccountInfo = value => {
    setSelectedAccount(bankAccountInfoList.find(info => info.id === value));
  };

  const onCheckout = (isFreeUpTable: boolean) => {
    const values = form.getFieldsValue();
    dispatch(checkOut({ ...values, orderId: currentOrder.id, freeUpTable: isFreeUpTable }));
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
        <div className="flex flex-col w-7/12">
          <h3 className="mb-4 text-blue-700">
            {'#' + currentOrder.code + ' - '}
            {!currentOrder.takeAway && currentOrder.tableList.length > 0 ? (
              <>
                {[...currentOrder.tableList].sort(alphabetCompare)[0].name}
                <span className="font-normal text-gray-400">
                  {currentOrder.tableList.length > 1 ? ` (+${currentOrder.tableList.length - 1})` : ''}
                </span>
              </>
            ) : (
              'Takeaway'
            )}
          </h3>
          <div className="flex items-center h-10 pl-4 mr-4 font-semibold text-gray-500 bg-gray-200 rounded-t-lg">
            <Translate contentKey="order.charge.itemList" />
          </div>
          <Scrollbars className="w-full grow">
            <Table
              rowKey={'id'}
              className="mr-4"
              bordered={false}
              pagination={false}
              columns={columns}
              showHeader={false}
              dataSource={groupedOderDetailList}
            ></Table>
          </Scrollbars>
        </div>
        <div className="flex flex-col justify-between w-5/12 h-full pt-8 pl-2 pr-4">
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
                <Input className="text-right " bordered={false} readOnly value={currencyFormatter(billDetail.subtotal)} />
              </Form.Item>
              <Popover
                placement="left"
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
                  name="discount"
                  initialValue={discount.number}
                  label={`${translate('order.charge.discount')}${discount.isByPercent ? ` (${discount.number}%)` : ''}`}
                  className="!mb-2 cursor-pointer"
                >
                  <InputNumber
                    bordered={false}
                    readOnly
                    className="w-full !text-right pr-7 !cursor-pointer"
                    controls={false}
                    formatter={currencyFormatter}
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
                    currencyFormatter(
                      billDetail.subtotal - (discount.isByPercent ? (billDetail.subtotal * discount.number) / 100 : discount.number)
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
                  <Form.Item label={''} name={'bankAccountInfo'} wrapperCol={{ span: 26 }}>
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
                      src={`https://img.vietqr.io/image/${selectedAccount.bin}-${
                        selectedAccount.accountNumber
                      }-compact.png?amount=${groupedOderDetailList.reduce(
                        (total, detail) => total + detail.quantity * detail.menuItem.sellPrice,
                        0
                      )}&addInfo=${currentOrder.code}-${restaurant.name}`}
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
              <Button
                size="large"
                type="primary"
                className="w-40"
                ghost
                icon={<PrinterFilled rev="" />}
                onClick={() => {
                  dispatch(printBill(currentOrder.id));
                }}
              >
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
          <InputNumber ref={inputRef} min={0} className="!text-right w-full" controls={false} formatter={currencyFormatter} />
        </Form.Item>
        <Form.Item name={'isByPercent'} initialValue={discount.isByPercent} wrapperCol={{ span: 26 }} className="grow !m-0">
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
