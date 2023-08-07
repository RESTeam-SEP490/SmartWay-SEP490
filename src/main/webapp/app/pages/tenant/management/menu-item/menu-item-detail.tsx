import React, { useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { CheckSquareFilled, DeleteFilled, EditFilled, LockFilled } from '@ant-design/icons';
import { Badge, Button, Form, Image, Input, InputNumber, Tabs, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { currencyFormatter, DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
import { useAppDispatch } from 'app/config/store';
import MenuItemDelete from './menu-item-dialog';
import { IMenuItem } from 'app/shared/model/menu-item.model';

export const MenuItemDetail = ({ menuItem, onUpdate }: { menuItem: IMenuItem; onUpdate: any }) => {
  const dispatch = useAppDispatch();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [isActive, setIsActive] = useState<boolean>();

  const handleDelete = () => {
    setIsActive(undefined);
    setIsShowDialog(true);
  };

  const handleUpdateisActive = () => {
    setIsActive(!menuItem.isActive);
    setIsShowDialog(true);
  };

  return (
    <>
      <div className="p-4 details max-w-[calc((100vw-32px)*4/5-66px)]">
        <div className="">
          <Typography.Title level={4}>{menuItem.name}</Typography.Title>
        </div>

        <div className="flex">
          {!menuItem.isActive ? (
            <Badge.Ribbon
              text={
                <span>
                  <LockFilled rev={''} className="mr-1" />
                  <Translate contentKey="menuItem.isActive.false" />
                </span>
              }
              className="px-3 py-1 text-sm border-2 border-red-100 border-solid shadow-md"
              color="red"
            >
              <Image
                preview={false}
                src={menuItem.imageUrl}
                width={200}
                height={200}
                className="overflow-hidden border-blue-300 border-solid rounded-md shadow-md border-spacing-2 bg-slate-500 bg-opacity-20"
              />
            </Badge.Ribbon>
          ) : (
            <Image
              preview={false}
              src={menuItem.imageUrl}
              width={200}
              height={200}
              className="overflow-hidden border-blue-300 border-solid rounded-md shadow-md border-spacing-2"
            />
          )}

          <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon className="flex-grow ml-6">
            <Form.Item className="!mb-0" label={translate('menuItem.code.label')}>
              <Input bordered={false} value={menuItem.code} />
            </Form.Item>
            <Form.Item className="!mb-0" label={translate('menuItem.category.label')}>
              <Input bordered={false} value={menuItem.menuItemCategory.name} />
            </Form.Item>
            <Form.Item className="!mb-0" label={translate('menuItem.basePrice.label')}>
              <InputNumber bordered={false} value={menuItem.basePrice} formatter={currencyFormatter} />
            </Form.Item>
            <Form.Item className="!mb-0" label={translate('menuItem.sellPrice.label')}>
              <InputNumber bordered={false} value={menuItem.sellPrice} formatter={currencyFormatter} />
            </Form.Item>
          </Form>
          <Form colon layout="vertical" className="flex-grow ml-6">
            <Form.Item colon label={translate('global.table.description')}>
              <TextArea autoSize style={{ resize: 'none', height: 'max-content' }} value={menuItem.description} bordered={false} />
            </Form.Item>
          </Form>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="primary" onClick={onUpdate}>
            <EditFilled rev={''} />
            <Translate contentKey="entity.action.edit" />
          </Button>
          {menuItem.isActive ? (
            <Button danger type="primary" icon={<LockFilled rev={''} />} onClick={handleUpdateisActive}>
              <Translate contentKey="menuItem.action.stopSell" />
            </Button>
          ) : (
            <Button type="primary" icon={<CheckSquareFilled rev={''} />} onClick={handleUpdateisActive}>
              <Translate contentKey="menuItem.action.allowSell" />
            </Button>
          )}
          <Button type="primary" danger onClick={handleDelete}>
            <DeleteFilled rev={''} />
            <Translate contentKey="entity.action.delete" />
          </Button>
        </div>
      </div>
      <MenuItemDelete menuItems={[menuItem]} handleClose={() => setIsShowDialog(false)} isOpen={isShowDialog} isActive={isActive} />
    </>
  );
};

export default MenuItemDetail;
