import { Button, Form, Modal, Radio, Select, Table } from 'antd';
import { currencyFormatter, DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import React, { useEffect, useState } from 'react';
import { Translate } from 'react-jhipster';
import { groupTables } from '../../order.reducer';
import { IOrder } from 'app/shared/model/order/order.model';
import { IDiningTable } from 'app/shared/model/dining-table.model';

const columns = [
  { title: 'Mã đơn', dataIndex: 'code', key: 'code' },
  {
    title: 'Tổng số lượng món',
    dataIndex: 'orderDetailList',
    key: 'totalQuantity',
    align: 'right' as const,
    render: (odList: IOrderDetail[]) => odList.reduce((prev: number, current: IOrderDetail) => prev + current.quantity, 0),
  },
  {
    title: 'Tổng tiền ',
    dataIndex: 'orderDetailList',
    key: 'total',
    align: 'right' as const,
    render: (odList: IOrderDetail[]) =>
      currencyFormatter(odList.reduce((prev: number, current: IOrderDetail) => prev + current.menuItem.sellPrice * current.quantity, 0)),
  },
];

export const TablesOfOrderModal = ({ isOpen, handleClose }: { isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);
  const tableList: IDiningTable[] = useAppSelector(state => state.diningTable.entities);
  const updating = useAppSelector(state => state.order.updating);
  const updateSuccess = useAppSelector(state => state.order.updateSuccess);
  const orders: IOrder[] = useAppSelector(state => state.order.activeOrders);

  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    form.setFieldsValue({ ...currentOrder, tableList: currentOrder.tableList.map(t => t.id) });
  }, [currentOrder]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const handleOnchangeTableList = () => {
    if (form.getFieldValue('tableList').length > 0) {
      const nextSelectedOrders = orders.filter(
        o => o.tableList.some(t => form.getFieldValue('tableList').includes(t.id)) && o.id !== currentOrder.id
      );
      setSelectedOrders(nextSelectedOrders);
    }
  };
  const handleSubmit = values => {
    dispatch(groupTables({ orderId: currentOrder.id, tableList: values.tableList }));
  };

  return (
    <Modal centered open={isOpen} destroyOnClose width={800} title={'#' + currentOrder.code} footer={[]} onCancel={handleClose}>
      <Form {...DEFAULT_FORM_ITEM_LAYOUT} labelAlign="left" form={form} onFinish={handleSubmit} className="mt-4">
        <div className="w-[400px]">
          <Form.Item name={'takeAway'} label={'Loại đơn'}>
            <Radio.Group>
              <Radio className="!font-normal" value={false}>
                Ngồi tại bàn
              </Radio>
              <Radio className="!font-normal" value={true}>
                Đơn mang đi
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={'tableList'} label={'Bàn'}>
            <Select mode="multiple" optionFilterProp="search" onChange={handleOnchangeTableList}>
              {tableList.map(table => (
                <Select.Option key={table.id} search={table.name}>
                  {table.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        <Table
          className="min-h-[240px]"
          scroll={{ y: 200 }}
          columns={columns}
          dataSource={selectedOrders}
          rowKey={'id'}
          pagination={false}
        ></Table>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="default" htmlType="reset" onClick={handleClose}>
            <Translate contentKey="entity.action.back">Back</Translate>
          </Button>
          <SubmitButton form={form} isNew={false} updating={updating} />
        </div>
      </Form>
    </Modal>
  );
};
