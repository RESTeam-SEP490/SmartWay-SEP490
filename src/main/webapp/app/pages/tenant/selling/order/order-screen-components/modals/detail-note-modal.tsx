import { Button, Form, Input, Modal, Typography } from 'antd';
import { currencyFormatter } from 'app/app.constant';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';
import { addNote } from '../../order.reducer';

export const AddNoteForm = ({ detail, isOpen, handleClose }: { detail: IOrderDetail; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const updating = useAppSelector(state => state.order.updating);
  const updateSuccess = useAppSelector(state => state.order.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  useEffect(() => {
    form.setFieldValue('note', detail?.note);
  }, [detail]);

  const handleSubmit = values => {
    dispatch(addNote({ orderDetailId: detail.id, note: values.note }));
  };

  return (
    <Modal
      centered
      open={isOpen}
      destroyOnClose
      width={400}
      title={<Translate contentKey="order.addNote.title" />}
      footer={[]}
      onCancel={handleClose}
    >
      <Form onFinish={handleSubmit}>
        <div className="flex items-center justify-between p-2 px-4 mt-6 bg-blue-100 rounded-t-md ">
          <Typography.Title level={5} className="!m-0" ellipsis={{ expandable: false, tooltip: detail?.menuItem.name }}>
            {detail?.menuItem.name}
          </Typography.Title>
          <div className="flex items-center gap-2">
            <Typography.Text>{currencyFormatter(detail?.menuItem.sellPrice)}</Typography.Text>
            <Typography.Text>{'x'}</Typography.Text>
            <Typography.Text>{detail?.quantity}</Typography.Text>
          </div>
        </div>
        <Form.Item name={'note'} initialValue={detail?.note} required>
          <Input.TextArea
            placeholder={translate('order.form.note.placeholder')}
            className="!resize-none !h-24 rounded-none !rounded-b-md"
          />
        </Form.Item>
        <div className="flex justify-end gap-2">
          <Button type="default" htmlType="reset" onClick={handleClose}>
            <Translate contentKey="entity.action.back">Back</Translate>
          </Button>
          <SubmitButton form={form} isNew={true} updating={updating} />
        </div>
      </Form>
    </Modal>
  );
};
