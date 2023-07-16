import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { StopOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tabs } from 'antd';
import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import ZoneSelect from '../zone/zone';
import { createEntity, updateEntity } from './dining-table.reducer';

export const DiningTableForm = ({
  diningTable,
  isOpen,
  handleClose,
}: {
  diningTable?: IDiningTable;
  isOpen: boolean;
  handleClose: any;
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const isNew = diningTable?.id === undefined;
  const updating = useAppSelector(state => state.diningTable.updating);
  const updateSuccess = useAppSelector(state => state.diningTable.updateSuccess);

  useEffect(() => {
    if (!isNew) {
      form.setFieldsValue({ ...diningTable });
    } else {
      form.resetFields();
    }
  }, [isNew]);
  useEffect(() => {
    if (updateSuccess) {
      form.resetFields();
      handleClose();
    }
  }, [updateSuccess]);
  const saveEntity = values => {
    const entity = {
      ...diningTable,
      ...values,
    };
    if (entity.zone.id === undefined) entity.zone = null;
    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  return (
    <>
      <Modal open={isOpen} footer={[]} onCancel={() => handleClose()}>
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} colon onFinish={saveEntity}>
          <Tabs className="p-2">
            <Tabs.TabPane tab={translate('diningTable.infoTabs.information')} key={1} className="flex gap-8 p-2">
              <div className="flex-grow">
                <Form.Item
                  label={translate('diningTable.name.label')}
                  name={'name'}
                  rules={[
                    { required: true, message: translate('entity.validation.required') },
                    { max: 100, message: translate('entity.validation.max', { max: 100 }) },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label={translate('diningTable.zone.label')}>
                  <ZoneSelect />
                </Form.Item>
              </div>
            </Tabs.TabPane>
          </Tabs>
          <div className="flex justify-end gap-2">
            <SubmitButton form={form} isNew={isNew} updating={updating} />
            <Button type="default" htmlType="reset" onClick={() => handleClose()}>
              <StopOutlined rev={''} />
              <Translate contentKey="entity.action.back">Back</Translate>
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default DiningTableForm;
