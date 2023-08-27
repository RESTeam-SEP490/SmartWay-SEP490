import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Typography } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { cancelOrderDetail, orderActions, serveItems } from '../../order.reducer';

export const ItemServeModal = ({ detail, isOpen, handleClose }: { detail: IOrderDetail; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const [serveQuantity, setServeQuantity] = useState(1);
  const updating = useAppSelector(state => state.order.updating);
  const updateSuccess = useAppSelector(state => state.order.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (detail) setServeQuantity(1);
  }, [detail]);

  const handleSubmit = () => {
    dispatch(serveItems({ orderDetailId: detail.id, serveQuantity }));
  };
  return (
    <>
      <Modal centered open={isOpen} destroyOnClose width={500} footer={[]} onCancel={handleClose}>
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} labelAlign="left" form={form} onFinish={handleSubmit} className="mt-2">
          <Typography.Text className="!block !mb-4 italic !text-blue-600">
            Serve item <b>{detail.menuItem.name}</b>
          </Typography.Text>
          <Form.Item label={translate('order.cancel.form.quantity')}>
            <div className="flex items-center text-blue-600 w-fit">
              <Button
                disabled={serveQuantity === 1}
                onClick={() => setServeQuantity(prev => prev - 1)}
                type="primary"
                size="small"
                className="!p-0 !w-6 !h-6 shadow-none flex justify-center items-center"
                icon={<MinusOutlined rev={''} />}
              />
              <div className="min-w-[40px] flex gap-1.5 justify-center items-end cursor-pointer">
                <Typography.Text className={`!m-0 font-semibold`}>{serveQuantity}</Typography.Text>
              </div>
              <Button
                disabled={serveQuantity === detail?.readyToServeQuantity}
                onClick={() => setServeQuantity(prev => prev + 1)}
                type="primary"
                size="small"
                className="!p-0 !w-6 !h-6 shadow-none flex justify-center items-center"
                icon={<PlusOutlined rev={''} />}
              />
              <div className="ml-4 text-gray-400">{`(Ready-to-serve quantity: ${detail?.readyToServeQuantity})`}</div>
            </div>
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="default" htmlType="reset" onClick={handleClose}>
              <Translate contentKey="entity.action.back">Back</Translate>
            </Button>
            <SubmitButton form={form} isNew={true} updating={updating} text="entity.action.confirm" />
          </div>
        </Form>
      </Modal>
    </>
  );
};
