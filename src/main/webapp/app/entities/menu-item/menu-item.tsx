import React, { useEffect, useRef, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { ImportOutlined, WarningOutlined } from '@ant-design/icons';
import { ExportOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Modal } from 'antd';
import { DeleteFilled, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Empty, Input, Table, Typography } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { IQueryParams } from 'app/shared/reducers/reducer.utils';
import { DEFAULT_PAGEABLE, currencyFormatter } from '../../app.constant';
import { DEFAULT_PAGIANTION_CONFIG } from '../../shared/util/pagination.constants';
import { MenuItemCategoryCheckBoxes } from '../menu-item-category/menu-item-category';
import MenuItemDetail from './menu-item-detail';
import MenuItemUpdate from './menu-item-form';
import { getEntities } from './menu-item.reducer';
import { render } from '@testing-library/react';

export const MenuItem = () => {
  const dispatch = useAppDispatch();

  const columns = [
    { title: <Translate contentKey="menuItem.code.label" />, dataIndex: 'code', key: 'code' },
    { title: <Translate contentKey="menuItem.name.label" />, dataIndex: 'name', key: 'name' },
    {
      title: <Translate contentKey="menuItem.category.label" />,
      dataIndex: ['menuItemCategory', 'name'],
      key: 'menuItemCategory',
    },
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
  const [pageable, setPageable] = useState<IQueryParams>(DEFAULT_PAGEABLE);

  const menuItemList = useAppSelector(state => state.menuItem.entities);
  const count = useAppSelector(state => state.menuItem.totalItems);
  const loading = useAppSelector(state => state.menuItem.loading);

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleCancelPopup = () => {
    setIsPopupVisible(false);
    resetUpload();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = event => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Đã chọn tệp:', selectedFile);
      // Gửi tệp lên máy chủ hoặc thực hiện xử lý khác tùy thuộc vào yêu cầu của bạn
    } else {
      console.log('Chưa chọn tệp');
    }
  };

  useEffect(() => {
    dispatch(getEntities(pageable));
  }, [pageable]);

  const handleOnchangePage = (page, pageSize) => {
    setPageable(prev => ({ ...prev, page: page - 1, size: pageSize }));
  };

  const handleOnchangeSearch = e => {
    const search = e.target.value;
    if (search !== pageable.query) setPageable(prev => ({ ...prev, page: 0, query: search }));
  };

  const handleOnchangeCategoryFilter = (checkedValues: CheckboxValueType[]) => {
    const selectedCategories = checkedValues.map(v => v.toString());
    setPageable(prev => ({ ...prev, page: 0, category: selectedCategories }));
  };
  return (
    <>
      <MenuItemUpdate handleClose={() => setIsShowForm(false)} isOpen={isShowForm} />

      <Modal visible={isPopupVisible} onCancel={handleCancelPopup} footer={null}>
        <p>
          Import Menu Items from Data File. Process Data (Download Sample File:{' '}
          <a href="http://localhost:8080/downloadTemplate" download>
            Excel File
          </a>
          ).
        </p>
        <div style={{ backgroundColor: '#f9f9e0', padding: '10px' }}>
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#7b5e2a' }}>
            <span style={{ fontWeight: 'bold' }}>
              <WarningOutlined style={{ marginRight: '0.5rem' }} rev={''} />
              Note:
            </span>
            <br />
            The system allows a maximum of 100 menu items to be imported from a file at a time.
            <br />
            <br />
            Menu item codes should not contain special characters (@, #, $, *, /, -, _,...) or accented letters, as they may cause
            difficulties when printing and using barcodes.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <div style={{ position: 'relative', marginRight: '10px' }}>
            <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} ref={fileInputRef} />
            <div>
              <Button style={{ float: 'right' }} className="green-button" onClick={() => fileInputRef.current.click()}>
                Select Data File
              </Button>
            </div>
            {selectedFile && (
              <div>
                <div style={{ float: 'right' }}>
                  <p>{selectedFile.name}</p>
                </div>
                <div>
                  <Button style={{ float: 'right' }} className="green-button" onClick={handleUpload}>
                    Upload
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

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
          <MenuItemCategoryCheckBoxes handleOnChange={handleOnchangeCategoryFilter} />
        </div>
        <div className="w-4/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <Typography.Title level={3} className="!mb-0">
              <Translate contentKey="menuItem.title" />
            </Typography.Title>
            <div className="flex gap-2">
              <Button onClick={handleOpenPopup} className="green-button">
                <span>
                  <ImportOutlined style={{ marginRight: '0.5rem' }} rev={''} />
                </span>
                Import
              </Button>
              <Button className="green-button">
                <span>
                  <ExportOutlined style={{ marginRight: '0.5rem' }} rev={''} />
                </span>
                Export
              </Button>
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
              ...DEFAULT_PAGIANTION_CONFIG,
              onChange: handleOnchangePage,
              total: count,
              current: pageable.page + 1,
            }}
            rowSelection={{ type: 'checkbox' }}
            rowKey={'id'}
            rowClassName={'cursor-pointer'}
            loading={loading}
            expandable={{
              expandedRowRender: record => <MenuItemDetail menuItem={record} />,
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
