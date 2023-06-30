import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Input, Table, Typography } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { IMenuItem } from 'app/shared/model/menu-item.model';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { DEFAULT_PAGEABLE, FormType, currencyFormatter } from '../../app.constant';
import { DEFAULT_PAGINATION_CONFIG } from '../../shared/util/pagination.constants';
import { MenuItemCategoryCheckBoxes } from '../menu-item-category/menu-item-category';
import MenuItemDetail from './menu-item-detail';
import MenuItemForm from './menu-item-form';
import { getEntities } from './menu-item.reducer';

export const MenuItem = () => {
  const dispatch = useAppDispatch();

  const columns = [
    { title: <Translate contentKey="menuItem.code.label" />, dataIndex: 'code', key: 'code' },
    { title: <Translate contentKey="menuItem.name.label" />, dataIndex: 'name', key: 'name' },
    { title: <Translate contentKey="menuItem.category.label" />, dataIndex: ['menuItemCategory', 'name'], key: 'menuItemCategory' },
    {
      title: <Translate contentKey="menuItem.basePrice.label" />,
      dataIndex: 'basePrice',
      key: 'basePrice',
      align: 'right' as const,
      render: p => currencyFormatter(p),
    },
    {
      title: <Translate contentKey="menuItem.sellPrice.label" />,
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      align: 'right' as const,
      render: p => currencyFormatter(p),
    },
  ];

  const [expendedRow, setExpendedRow] = useState();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IMenuItem>();
  const [pageable, setPageable] = useState<IQueryParams>(DEFAULT_PAGEABLE);

  const menuItemList = useAppSelector(state => state.menuItem.entities);
  const categoryList = useAppSelector(state => state.menuItemCategory.entities);
  const count = useAppSelector(state => state.menuItem.totalItems);
  const loading = useAppSelector(state => state.menuItem.loading);

  useEffect(() => {
    dispatch(getEntities(pageable));
  }, [pageable]);

  const handleOnchangePage = (page, pageSize) => {
    setPageable(prev => ({ ...prev, page: page - 1, size: pageSize }));
  };

  const handleOnchangeSearch = e => {
    const search = e.target.value;
    if (search !== pageable.search) setPageable(prev => ({ ...prev, page: 0, query: search }));
  };

  const handleOnchangeCategoryFilter = (checkedValues: CheckboxValueType[]) => {
    const isCheckAll = checkedValues.length === categoryList?.length;
    const selectedCategories = isCheckAll ? undefined : checkedValues.map(v => v.toString());
    setPageable(prev => ({ ...prev, page: 0, category: selectedCategories }));
  };

  const handleOpen = (formType: FormType, item: IMenuItem) => {
    setSelectedItem(item);
    if (formType === 'delete') setIsShowDeleteConfirm(true);
    else setIsShowForm(true);
  };
  const handleClose = (formType: FormType) => {
    setSelectedItem(undefined);
    if (formType === 'delete') setIsShowDeleteConfirm(false);
    else setIsShowForm(false);
  };
  return (
    <>
      <MenuItemForm menuItem={selectedItem} handleClose={() => handleClose('edit')} isOpen={isShowForm} />

      <div className="flex h-full p-2">
        <div className="flex flex-col w-1/5 gap-4 p-4">
          <Card bordered={false}>
            <Typography.Title level={5}>
              <Translate contentKey="entity.action.find" />
            </Typography.Title>
            <Input
              placeholder={translate('menuItem.search.placeholder')}
              onPressEnter={handleOnchangeSearch}
              onBlur={handleOnchangeSearch}
            />
          </Card>
          <MenuItemCategoryCheckBoxes onFilter={handleOnchangeCategoryFilter} />
        </div>
        <div className="w-4/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <Typography.Title level={3} className="!mb-0">
              <Translate contentKey="menuItem.title" />
            </Typography.Title>
            <div className="flex gap-2">
              <Button type="primary" onClick={() => setIsShowForm(true)}>
                <PlusOutlined rev={''} />
                <Translate contentKey="menuItem.addNewLabel" />
              </Button>
              <Button danger>
                <DeleteFilled rev={''} />
                <Translate contentKey="entity.action.delete" />
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={menuItemList}
            pagination={{
              ...DEFAULT_PAGINATION_CONFIG,
              onChange: handleOnchangePage,
              total: count,
              current: pageable.page + 1,
              locale: { items_per_page: '/ ' + translate('global.table.pageText') },
            }}
            rowSelection={{ type: 'checkbox' }}
            rowKey={'id'}
            rowClassName={'cursor-pointer'}
            loading={loading}
            expandable={{
              expandedRowRender: record => <MenuItemDetail menuItem={record} onUpdate={() => handleOpen('edit', record)} />,
              expandedRowClassName: () => '!bg-white',
              expandRowByClick: true,
              expandIcon: () => <></>,
              expandedRowKeys: [expendedRow],
              onExpand(expended, record) {
                if (expended) setExpendedRow(record.id);
                else setExpendedRow(undefined);
              },
            }}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />,
            }}
          ></Table>
        </div>
      </div>
    </>
  );
};

export default MenuItem;
