import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Switch, Table } from 'antd';
import { alphabetCompare } from 'app/app.constant';
import { useAppSelector } from 'app/config/store';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import { IOrder } from 'app/shared/model/order/order.model';
import { CurrencyFormat } from 'app/shared/util/currency-utils';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

export const ReturnItemsModal = ({ setBillDetail }) => {
  const [currentODList, setCurrentODList] = useState([]);
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const [isReturn, setIsReturn] = useState(false);

  useEffect(() => {
    setBillDetail({
      totalQuantity: currentODList.reduce((totalQuantity, detail) => totalQuantity + detail.quantity - detail.returnQuantity, 0),
      subtotal: currentODList.reduce((total, detail) => total + (detail.quantity - detail.returnQuantity) * detail.menuItem.sellPrice, 0),
    });
  }, [currentODList]);

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
        returnQuantity: 0,
      };
      nextGroupedOderDetailList.push(detail);
    });

    setCurrentODList(nextGroupedOderDetailList.filter(detail => detail.quantity > 0));
    setBillDetail({
      totalQuantity: currentODList.reduce((totalQuantity, detail) => totalQuantity + detail.quantity - detail.returnQuantity, 0),
      subtotal: currentODList.reduce((total, detail) => total + (detail.quantity - detail.returnQuantity) * detail.menuItem.sellPrice, 0),
    });
  }, [currentOrder]);

  const columns = [
    {
      dataIndex: ['menuItem', 'name'],
      title: 'Item name',
      key: 'name',
      width: '30%',
      render: (name, detail) => (
        <div className="flex flex-col">
          {name}
          <span className="text-blue-600">{detail.note}</span>
        </div>
      ),
    },
    {
      dataIndex: 'returnQuantity',
      title: 'Return',
      width: '11%',
      align: 'center' as const,
      key: 'return-quantity',
      render: (q, detail) => (
        <div className="flex items-center justify-between gap-2 w-[80px]">
          <Button
            disabled={detail.returnQuantity === 0}
            type="primary"
            size="small"
            ghost
            icon={<MinusOutlined rev={''} />}
            onClick={() => handleEditReturnQuantity(detail.id, -1)}
          ></Button>
          <span>{q}</span>
          <Button
            disabled={detail.returnQuantity === detail.quantity}
            type="primary"
            size="small"
            icon={<PlusOutlined rev={''} />}
            onClick={() => handleEditReturnQuantity(detail.id, 1)}
          ></Button>
        </div>
      ),
    },
    {
      dataIndex: ['quantity'],
      title: 'Quantity',
      key: 'quantity',
      width: '15%',
      align: 'center' as const,
      render: (q, detail) => (
        <span className="relative flex items-start justify-center gap-1">
          {q - detail.returnQuantity}
          {isReturn && <span className="text-xs text-gray-500">{'/' + q}</span>}
        </span>
      ),
    },
    {
      dataIndex: ['menuItem', 'sellPrice'],
      title: 'Price',
      key: 'price',
      width: '22%',
      align: 'right' as const,

      render: price => <CurrencyFormat>{price}</CurrencyFormat>,
    },
    {
      dataIndex: ['quantity'],
      key: 'subTotal',
      width: '22%',
      align: 'right' as const,
      render: (quantity, detail) => (
        <span className="font-semibold">
          <CurrencyFormat>{(quantity - detail.returnQuantity) * detail.menuItem.sellPrice}</CurrencyFormat>
        </span>
      ),
    },
  ];

  const handleEditReturnQuantity = (id: string, quantityAdjust: number) => {
    setCurrentODList(prev =>
      prev.map(detail => {
        if (detail.id === id) return { ...detail, returnQuantity: detail.returnQuantity + quantityAdjust };
        else return detail;
      })
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
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
        <div className="flex items-center gap-2 mb-4">
          Return items
          <Switch checked={isReturn} onChange={checked => setIsReturn(checked)}></Switch>
        </div>
      </div>
      <Scrollbars className="w-full grow">
        <Table
          rowKey={'id'}
          bordered={false}
          pagination={false}
          columns={!isReturn ? columns.filter(col => col.key !== 'return-quantity') : columns}
          size="small"
          dataSource={currentODList}
        ></Table>
      </Scrollbars>
    </>
  );
};

export default ReturnItemsModal;
