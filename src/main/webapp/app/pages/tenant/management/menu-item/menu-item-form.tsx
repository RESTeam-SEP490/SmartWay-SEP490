import ImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { DeleteOutlined, InfoCircleFilled, PlusOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, InputNumber, message, Modal, Tabs, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { currencyFormatter, DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { SubmitButton } from 'app/shared/layout/form-shared-component';
import { IMenuItem } from 'app/shared/model/menu-item.model';
import { getBase64 } from 'app/shared/util/image-utils';
import MenuItemCategorySelect from '../menu-item-category/menu-item-category';
import { createEntity, updateEntity } from './menu-item.reducer';

export const MenuItemForm = ({ menuItem, isOpen, handleClose }: { menuItem?: IMenuItem; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState();

  const isNew = menuItem?.id === undefined;
  const updating = useAppSelector(state => state.menuItem.updating);
  const updateSuccess = useAppSelector(state => state.menuItem.updateSuccess);

  useEffect(() => {
    if (!isNew) {
      setImageUrl(menuItem.imageUrl);
      form.setFieldsValue({ ...menuItem, image: menuItem.imageUrl });
    } else {
      setImageUrl('');
      form.resetFields();
    }
  }, [isNew]);

  useEffect(() => {
    if (updateSuccess) {
      setImageUrl('');
      form.resetFields();
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...menuItem,
      ...values,
      imageSource,
      imageUrl,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const handleOnChangeImage = async ({ file }) => {
    if (file.status !== 'removed') {
      const nextPreviewImage = await getBase64(file.originFileObj as RcFile);
      setImageUrl(nextPreviewImage);
      form.setFieldsValue({ ...form.getFieldsValue, image: nextPreviewImage });
      setImageSource(file.originFileObj);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    form.setFieldsValue({ ...form.getFieldsValue, image: '' });
    setImageSource(undefined);
  };
  const beforeCrop = (file: RcFile) => {
    const isImageFile = file.type.includes('image');
    if (!isImageFile) {
      message.error('You can only upload image file!');
      return false;
    }
    return true;
  };
  const beforeUpload = (file: RcFile) => {
    const isSmallerThan128KB = file.size / 1024 < 128;
    if (!isSmallerThan128KB) {
      message.error('Image must smaller than 128KB!');
      return false;
    }
    return true;
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
            interpolate={{ entity: translate('global.menu.entities.menuItem').toLowerCase() }}
          />
        }
        footer={[]}
        onCancel={() => handleClose()}
      >
        <Form {...DEFAULT_FORM_ITEM_LAYOUT} form={form} colon onFinish={saveEntity} className="p-2">
          <div className="flex gap-8 p-2">
            <div className="flex-grow">
              <Form.Item label={translate('menuItem.code.label')} name={'code'}>
                <Input disabled prefix={<InfoCircleFilled rev={''} />} placeholder={translate('menuItem.code.placeholder')} />
              </Form.Item>
              <Form.Item
                label={translate('menuItem.name.label')}
                name={'name'}
                rules={[
                  { required: true, message: translate('entity.validation.required') },
                  { max: 100, message: translate('entity.validation.max', { max: 100 }) },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label={translate('menuItem.category.label')} required>
                <MenuItemCategorySelect />
              </Form.Item>
              <Form.Item
                label={translate('global.table.description')}
                name={'description'}
                className="h-full"
                rules={[{ max: 255, message: translate('entity.validation.max', { max: 30 }) }]}
              >
                <Input.TextArea showCount style={{ resize: 'none', height: 120 }} maxLength={255} />
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
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <InputNumber min={0} className="w-40" keyboard formatter={currencyFormatter} />
              </Form.Item>
              <Form.Item labelCol={{ span: 10 }} label={translate('menuItem.image.label')} name={'image'}>
                <div className="flex flex-col flex-wrap items-center content-start justify-center gap-2">
                  <Image
                    src={imageUrl}
                    preview={false}
                    className="!w-40 !h-40 shadow-sm border-solid border-2 rounded-md border-slate-200"
                    fallback="data:image/png;base64,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"
                  />

                  <ImgCrop beforeCrop={beforeCrop}>
                    <Upload
                      maxCount={1}
                      customRequest={({ file, onSuccess }) => onSuccess('ok')}
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onChange={handleOnChangeImage}
                    >
                      {imageUrl.length === 0 && (
                        <Button icon={<PlusOutlined rev={''} />}>
                          <Translate contentKey="menuItem.image.placeholder" />
                        </Button>
                      )}
                    </Upload>
                  </ImgCrop>

                  {imageUrl.length > 0 && (
                    <Button danger icon={<DeleteOutlined rev={''} />} onClick={handleRemoveImage}>
                      <Translate contentKey="entity.action.delete" />
                    </Button>
                  )}
                </div>
              </Form.Item>
            </div>
          </div>
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

export default MenuItemForm;
