import { Button, ConfigProvider, Drawer, Form, Input, InputNumber, Table } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IMenuItem } from 'app/shared/model/menu-item.model';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import { IOrder } from 'app/shared/model/order/order.model';
import React, { useEffect, useState } from 'react';
import { translate, Translate } from 'react-jhipster';
import { render } from '@testing-library/react';
import { DEFAULT_FORM_ITEM_LAYOUT, alphabetCompare, currencyFormatter } from 'app/app.constant';
import Scrollbars from 'react-custom-scrollbars-2';
import { CreditCardFilled, CreditCardOutlined, MoneyCollectFilled, PrinterFilled, PrinterOutlined } from '@ant-design/icons';
import { colors } from 'app/config/ant-design-theme';
import { MdMonetizationOn, MdPrint } from 'react-icons/md';
import { pay, printBill } from '../order.reducer';

export const Charge = ({ isOpen, handleClose }: { isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(state => state.order.loading);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const [groupedOderDetailList, setGroupedOderDetailList] = useState([]);

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

  return (
    <>
      <Drawer
        open={isOpen}
        className="flex rounded-l-lg"
        title={translate('order.charge.label')}
        closable={true}
        onClose={() => handleClose(false)}
        width={800}
      >
        <div className="flex flex-col w-7/12">
          <h3 className="mb-4 text-blue-700">
            {'#' + currentOrder.code + ' - '}
            {currentOrder.tableList.length > 0 && [...currentOrder.tableList].sort(alphabetCompare)[0].name}
            <span className="font-normal text-gray-400">
              {currentOrder.tableList.length > 1 ? ` (+${currentOrder.tableList.length - 1})` : ''}
            </span>
          </h3>
          <div className="flex items-center h-10 pl-4 mr-4 font-semibold text-gray-500 bg-gray-200 rounded-t-lg">
            <Translate contentKey="order.charge.itemList" />
          </div>
          <Scrollbars className="w-full grow">
            <Table
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
            <Form labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} labelAlign="left" className="label-font-normal">
              <Form.Item label={translate('order.charge.quantity')} className="!mb-2">
                <Input
                  className="text-right "
                  bordered={false}
                  readOnly
                  value={groupedOderDetailList.reduce((totalQuantity, detail) => totalQuantity + detail.quantity, 0)}
                />
              </Form.Item>
              <Form.Item label={translate('order.charge.subtotal')} className="!mb-2">
                <Input
                  className="text-right "
                  bordered={false}
                  readOnly
                  value={currencyFormatter(
                    groupedOderDetailList.reduce((total, detail) => total + detail.quantity * detail.menuItem.sellPrice, 0)
                  )}
                />
              </Form.Item>
              <Form.Item name={'discount'} label={translate('order.charge.discount')} className="!mb-2">
                <InputNumber className="w-full !text-right" controls={false} formatter={currencyFormatter} defaultValue={0} />
              </Form.Item>
              <Form.Item label={translate('order.orderDetails.total')} className="!mb-2 bg-blue-100 rounded-md label-font-semibol">
                <Input
                  className="text-lg font-semibold text-right text-blue-600"
                  bordered={false}
                  readOnly
                  value={currencyFormatter(
                    groupedOderDetailList.reduce((total, detail) => total + detail.quantity * detail.menuItem.sellPrice, 0)
                  )}
                />
              </Form.Item>
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
                In tạm tính
              </Button>
              <Button
                size="large"
                type="primary"
                className="w-40"
                icon={<CreditCardOutlined rev="" />}
                onClick={() => {
                  dispatch(pay(currentOrder.id));
                }}
              >
                Thanh toán
              </Button>
            </div>
          </ConfigProvider>
        </div>
      </Drawer>
    </>
  );
};
