import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { InfoCircleFilled, StopOutlined } from '@ant-design/icons';
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

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        destroyOnClose
        width={1000}
        title={
          <Translate
            contentKey={isNew ? 'entity.label.addNew' : 'entity.label.edit'}
            interpolate={{ entity: translate('global.menu.entities.diningTable').toLowerCase() }}
          />
        }
        footer={[]}
        onCancel={() => handleClose()}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} colon onFinish={saveEntity}>
          <Tabs className="p-2">
            <Tabs.TabPane tab={translate('diningTable.infoTabs.information')} key={1} className="flex gap-8 p-2">
              <div className="flex-grow">
                {/* <Form.Item label={translate('diningTable.code.label')} name={'code'}> */}
                {/*   <Input disabled prefix={<InfoCircleFilled rev={''} />} placeholder={translate('diningTable.code.placeholder')} /> */}
                {/* </Form.Item> */}
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
                <Form.Item label={translate('diningTable.zone.label')} required>
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
