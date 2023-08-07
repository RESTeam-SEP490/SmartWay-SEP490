import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { cancelOrderDetail } from '../../order.reducer';

export const ItemCancellationModal = ({ detail, isOpen, handleClose }: { detail: IOrderDetail; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const [cancelledQuantity, setCancelQuantity] = useState(0);
  const [isShowReasonNote, setIsShowReasonNote] = useState(false);
  const updating = useAppSelector(state => state.order.updating);
  const updateSuccess = useAppSelector(state => state.order.updateSuccess);

  useEffect(() => {
    form.setFieldValue('cancelServedItemsFirst', false);
    form.setFieldValue('reason', 2);
  }, [isOpen]);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (detail) setCancelQuantity(detail.quantity);
  }, [detail]);

  const handleSubmit = values => {
    dispatch(cancelOrderDetail({ ...values, orderDetailId: detail.id, cancelledQuantity }));
  };
  return (
    <>
      <Modal centered open={isOpen} destroyOnClose width={500} title={translate('order.cancel.title')} footer={[]} onCancel={handleClose}>
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} labelAlign="left" form={form} onFinish={handleSubmit} className="mt-4">
          <Typography.Text className="!block !mb-4 italic">
            {translate('order.cancel.confirm', { name: detail?.menuItem?.name || '' })}
          </Typography.Text>
          <Form.Item name={'cancelServedItemsFirst'} label={translate('order.cancel.form.order')}>
            <Select>
              <Select.Option className="font-normal" value={false}>
                <Translate contentKey="order.cancel.form.order.unserved" />
              </Select.Option>
              <Select.Option className="font-normal" value={true}>
                <Translate contentKey="order.cancel.form.order.served" />
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={translate('order.cancel.form.quantity')}>
            <div className="flex items-center text-blue-600 w-fit">
              <Button
                disabled={cancelledQuantity === 1}
                onClick={() => setCancelQuantity(prev => prev - 1)}
                type="primary"
                size="small"
                className="!p-0 !w-6 !h-6 shadow-none flex justify-center items-center"
                icon={<MinusOutlined rev={''} />}
              />
              <div className="min-w-[40px] flex gap-1.5 justify-center items-end cursor-pointer">
                <Typography.Text className={`!m-0 font-semibold`}>{cancelledQuantity}</Typography.Text>
              </div>
              <Button
                disabled={cancelledQuantity === detail?.quantity}
                onClick={() => setCancelQuantity(prev => prev + 1)}
                type="primary"
                size="small"
                className="!p-0 !w-6 !h-6 shadow-none flex justify-center items-center"
                icon={<PlusOutlined rev={''} />}
              />
              <div className="ml-4 text-gray-400">{`(${translate('order.cancel.form.totalQ')}: ${detail?.quantity})`}</div>
            </div>
          </Form.Item>
          <Form.Item name={'reason'} label={translate('order.cancel.form.reason')}>
            <Select
              onChange={value => {
                if (value === 1) setIsShowReasonNote(true);
                else setIsShowReasonNote(false);
              }}
            >
              <Select.Option className="font-normal" value={1}>
                Khác
              </Select.Option>
              <Select.Option className="font-normal" value={2}>
                Khách hàng không hài lòng
              </Select.Option>
              <Select.Option className="font-normal" value={3}>
                Khách hàng đợi lâu
              </Select.Option>
              <Select.Option className="font-normal" value={4}>
                Khách hàng đổi món
              </Select.Option>
              <Select.Option className="font-normal" value={5}>
                Khách hàng huỷ món
              </Select.Option>
              <Select.Option className="font-normal" value={6}>
                Nhà hàng hết món
              </Select.Option>
            </Select>
          </Form.Item>
          {isShowReasonNote && (
            <Form.Item name={'note'} label={<></>} initialValue={detail?.note} colon={false}>
              <Input.TextArea placeholder={translate('order.form.note.placeholder')} className="!resize-none !h-24" />
            </Form.Item>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button type="default" htmlType="reset" onClick={handleClose}>
              <Translate contentKey="entity.action.back">Back</Translate>
            </Button>
            <SubmitButton form={form} isNew={true} updating={updating} />
          </div>
        </Form>
      </Modal>
    </>
  );
};
