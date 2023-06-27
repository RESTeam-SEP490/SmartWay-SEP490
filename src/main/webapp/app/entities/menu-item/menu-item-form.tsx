import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from 'react';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { InfoCircleFilled, PlusOutlined, SaveFilled, StopOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, InputNumber, Modal, Tabs, Upload, message } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { DEFAULT_FORM_ITEM_LAYOUT, currencyFormatter } from 'app/app.constant';
import { IMenuItem, defaultValue } from 'app/shared/model/menu-item.model';
import MenuItemCategorySelect from '../menu-item-category/menu-item-category';
import { createEntity, getEntity, updateEntity } from './menu-item.reducer';

export const MenuItemUpdate = ({ id, isOpen, handleClose }: { id?: string; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [imageSource, setImageSource] = useState();

  const isNew = id === undefined;

  const menuItem = useAppSelector(state => state.menuItem.entity);
  const loading = useAppSelector(state => state.menuItem.loading);
  const updating = useAppSelector(state => state.menuItem.updating);
  const updateSuccess = useAppSelector(state => state.menuItem.updateSuccess);

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...menuItem,
      ...values,
      imageSource,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () => {
    const m: IMenuItem = defaultValue;
    return isNew ? m : { m, ...menuItem };
  };

  const handleOnChangeFileList = info => {
    const nextFileList = [info.file];
    if (info.file.status !== 'removed') {
      setFileList(nextFileList);
      setImageSource(info.file.originFileObj);
    }
  };

  const handleRemoveFileList = info => {
    setFileList([]);
    setImageSource(undefined);
  };

  const beforeUpload = (file: RcFile) => {
    const isImageFile = file.type.includes('image');
    if (!isImageFile) {
      message.error('You can only upload image file!');
      return false;
    }
    const isSmallerThan25MB = file.size / 1024 / 1024 < 25;
    if (!isSmallerThan25MB) {
      message.error('Image must smaller than 2MB!');
      return false;
    }
    return true;
  };

  return (
    <>
      <Modal open={isOpen} width={1000} title={<Translate contentKey="menuItem.addNewLabel" />} footer={[]} onCancel={() => handleClose()}>
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon initialValues={() => defaultValues()} onFinish={saveEntity}>
          <Tabs className="p-2">
            <Tabs.TabPane tab={translate('menuItem.infoTabs.information')} key={1} className="flex gap-8 p-2">
              <div className="flex-grow">
                <Form.Item label={translate('menuItem.code.label')} name={'code'}>
                  <Input disabled prefix={<InfoCircleFilled rev={''} />} placeholder={translate('menuItem.code.placeholder')} />
                </Form.Item>
                <Form.Item
                  label={translate('menuItem.name.label')}
                  name={'name'}
                  rules={[{ required: true, message: translate('menuItem.validate.name.required') }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label={translate('menuItem.category.label')} required>
                  <MenuItemCategorySelect />
                </Form.Item>
                <Form.Item label={translate('global.table.description')} name={'description'} className="h-full">
                  <Input.TextArea showCount style={{ resize: 'none', height: 120 }} maxLength={254} />
                </Form.Item>
              </div>
              <div className="h-max w-80">
                <Form.Item labelCol={{ span: 10 }} label={translate('menuItem.basePrice.label')} name={'basePrice'} initialValue={0}>
                  <InputNumber min={0} className="w-40" keyboard formatter={currencyFormatter} />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 10 }}
                  label={translate('menuItem.sellPrice.label')}
                  name={'sellPrice'}
                  initialValue={0}
                  rules={[{ required: true, message: translate('menuItem.validate.name.required') }]}
                >
                  <InputNumber min={0} className="w-40" keyboard formatter={currencyFormatter} />
                </Form.Item>
                <Form.Item
                  labelCol={{ span: 10 }}
                  colon={false}
                  name={'imageSource'}
                  label={translate('menuItem.image.placeholder')}
                  valuePropName={'file'}
                >
                  <ImgCrop beforeCrop={beforeUpload}>
                    <Upload
                      maxCount={1}
                      customRequest={({ file, onSuccess }) => onSuccess('ok')}
                      listType="picture-card"
                      showUploadList={{ showPreviewIcon: false }}
                      fileList={fileList}
                      beforeUpload={beforeUpload}
                      onChange={handleOnChangeFileList}
                      onRemove={handleRemoveFileList}
                    >
                      {fileList.length < 1 && (
                        <div>
                          <PlusOutlined rev={''} />
                          <div>
                            <Translate contentKey="menuItem.image.placeholder" />
                          </div>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab={translate('menuItem.infoTabs.ingredients')} key={2}></Tabs.TabPane>
          </Tabs>
          <div className="flex justify-end gap-2">
            <Button type="primary" htmlType="submit" loading={loading}>
              <SaveFilled rev={''} />
              Save
            </Button>
            <Button type="default" htmlType="reset" onClick={() => handleClose()}>
              <StopOutlined rev={''} />
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default MenuItemUpdate;
