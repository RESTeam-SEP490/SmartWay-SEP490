import { Button, Form, Input, Modal, Select, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IOrder } from 'app/shared/model/order/order.model';
import React from 'react';
import { Translate, translate } from 'react-jhipster';
import { useState } from 'react';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { cancelOrder } from '../../order.reducer';
import { useEffect } from 'react';

export const OrderCancellationModal = ({ isOpen, handleClose }: { isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const currentOrder: IOrder = useAppSelector(state => state.order.currentOrder);

  const [isShowReasonNote, setIsShowReasonNote] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue('cancellationReason', 'CUSTOMER_UNSATISFIED');
  }, [isOpen]);

  const handleSubmit = values => {
    dispatch(cancelOrder({ ...values, orderId: currentOrder.id }));
  };

  return (
    <>
      <Modal centered open={isOpen} destroyOnClose width={500} onCancel={handleClose} footer={[]}>
        <Typography.Text className="!block !mb-4 italic">
          {translate('order.cancel.confirm', { name: ' Order #' + currentOrder?.code || '' })}
        </Typography.Text>
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} labelAlign="left" form={form} onFinish={handleSubmit} className="mt-4">
          <Form.Item name={'cancellationReason'} label={translate('order.cancel.form.reason')}>
            <Select
              onChange={value => {
                if (value === 1) setIsShowReasonNote(true);
                else setIsShowReasonNote(false);
              }}
            >
              <Select.Option className="font-normal" value={'CUSTOMER_UNSATISFIED'}>
                Customer is unsatisfied with items
              </Select.Option>
              <Select.Option className="font-normal" value={'LONG_WAITING_TIME'}>
                Customer waited for a long time
              </Select.Option>
              <Select.Option className="font-normal" value={'EXCHANGE_ITEM'}>
                Customer changed their order
              </Select.Option>
              <Select.Option className="font-normal" value={'OUT_OF_STOCK'}>
                Items is unavailable
              </Select.Option>
              <Select.Option className="font-normal" value={'OTHERS'}>
                Others
              </Select.Option>
            </Select>
          </Form.Item>
          {isShowReasonNote && (
            <Form.Item name={'cancellationNote'} label={<></>} colon={false}>
              <Input.TextArea placeholder={translate('order.form.note.placeholder')} className="!resize-none !h-24" />
            </Form.Item>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="default" htmlType="reset" onClick={handleClose}>
              <Translate contentKey="entity.action.back">Back</Translate>
            </Button>
            <Button type="primary" htmlType="submit" onClick={handleClose}>
              <Translate contentKey="entity.action.confirm">Confirm</Translate>
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default OrderCancellationModal;
