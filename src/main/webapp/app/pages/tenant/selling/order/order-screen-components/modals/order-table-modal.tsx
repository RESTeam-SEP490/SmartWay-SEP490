import { Button, Form, Modal, Radio, Select, Table } from 'antd';
import { currencyFormatter, DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { groupTables } from '../../order.reducer';
import { IOrder } from 'app/shared/model/order/order.model';
import { IDiningTable } from 'app/shared/model/dining-table.model';

const columns = [
  { title: <Translate contentKey="order.form.table.code" />, dataIndex: 'code', key: 'code' },
  {
    title: <Translate contentKey="order.form.table.quantity" />,
    dataIndex: 'orderDetailList',
    key: 'totalQuantity',
    align: 'right' as const,
    render: (odList: IOrderDetail[]) => odList.reduce((prev: number, current: IOrderDetail) => prev + current.quantity, 0),
  },
  {
    title: <Translate contentKey="order.form.table.price" />,
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
    if (isOpen) form.setFieldsValue({ ...currentOrder, tableList: currentOrder.tableList.map(t => t.id) });
  }, [currentOrder, isOpen]);

  useEffect(() => {
    if (isOpen) handleOnchangeTableList();
  }, [orders]);

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

  const isTableMerged = (tableId: string) => {
    const order = orders.filter(o => !o.takeAway).find(o => o.tableList.some(t => t.id === tableId));
    if (order) return order.tableList.length > 1;
    return false;
  };

  return (
    <Modal centered open={isOpen} destroyOnClose width={700} title={'#' + currentOrder.code} footer={[]} onCancel={handleClose}>
      <Form {...DEFAULT_FORM_ITEM_LAYOUT} requiredMark={false} labelAlign="left" form={form} onFinish={handleSubmit} className="mt-4">
        <div className="w-[400px]">
          <Form.Item name={'takeAway'} label={translate('order.form.label.type')}>
            <Radio.Group>
              <Radio className="!font-normal" value={false}>
                <Translate contentKey="order.form.type.atTable" />
              </Radio>
              <Radio className="!font-normal" value={true}>
                <Translate contentKey="order.form.type.takeaway" />
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name={'tableList'}
            label={translate('order.form.label.table')}
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 bàn' }]}
          >
            <Select mode="multiple" optionFilterProp="search" onChange={handleOnchangeTableList}>
              {tableList
                .filter(t => !isTableMerged(t.id) || currentOrder.tableList.some(x => x.id === t.id))
                .map(table => (
                  <Select.Option key={table.id} search={table.name}>
                    {table.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </div>
        <div className="mb-2 border-0 border-t border-solid border-slate-200"></div>
        <Form.Item label={translate('order.form.label.toMergeOrder')} className="!mb-2"></Form.Item>
        <Table
          className="min-h-[240px] block w-full"
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
