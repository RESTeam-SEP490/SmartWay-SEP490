import React, { useEffect, useRef, useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { BarsOutlined, PlusOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Empty, Input, MenuProps, message, Modal, Radio, Table, Tag, Typography } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { IMenuItem } from 'app/shared/model/menu-item.model';
import MenuItemDetail from './menu-item-detail';
import { MenuItemDialog } from './menu-item-dialog';
import MenuItemForm from './menu-item-form';
import { getEntities, setPageable } from './menu-item.reducer';
import { getEntities as loadCategory } from '../menu-item-category/menu-item-category.reducer';
import { currencyFormatter } from 'app/app.constant';
import { DEFAULT_PAGINATION_CONFIG } from '../../../../shared/util/pagination.constants';
import { MenuItemCategoryCheckBoxes } from '../menu-item-category/menu-item-category';
import axios from 'axios';

export const MenuItem = () => {
  const dispatch = useAppDispatch();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div onClick={() => handleDelete()}>
          <Translate contentKey="entity.action.delete" />
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => handleUpdateIsActive(true)}>
          <Translate contentKey="menuItem.action.allowSell" />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={() => handleUpdateIsActive(false)}>
          <Translate contentKey="menuItem.action.stopSell" />
        </div>
      ),
    },
  ];

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
    {
      title: <Translate contentKey="menuItem.status.label" />,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (i: boolean) => <Translate contentKey={i ? 'menuItem.status.trueValue' : 'menuItem.status.falseValue'} />,
    },
  ];

  const [expendedRow, setExpendedRow] = useState();

  const [isShowDialog, setIsShowDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IMenuItem[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [allowSale, setAllowSale] = useState<boolean>();

  const [isShowForm, setIsShowForm] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<IMenuItem>();

  const menuItemList = useAppSelector(state => state.menuItem.entities);
  const pageable = useAppSelector(state => state.menuItem.pageable);
  const updateSuccess = useAppSelector(state => state.menuItem.updateSuccess);

  const categoryList = useAppSelector(state => state.menuItemCategory.entities);
  const categoryUpdateSuccess = useAppSelector(state => state.menuItemCategory.updateSuccess);
  const count = useAppSelector(state => state.menuItem.totalItems);
  const loading = useAppSelector(state => state.menuItem.loading);
  const [menuItems, setMenuItems] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleCancelPopup = () => {
    setIsPopupVisible(false);
    resetUpload();
    setError(null);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setError(
        <span style={{ color: 'red' }}>
          <Translate contentKey={'menuItem.fileInvalid'}></Translate>
        </span>
      );
    }
  };

  const [uploadMessage, setUploadMessage] = useState('');

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      fileInputRef.current.value = null;
      formData.append('file', selectedFile);
      try {
        const response = await axios.post('/api/menu-items/import-menu-item', formData);
        setIsPopupVisible(false);
        setTimeout(() => {
          message.success(translate('diningTable.uploadSuccess'));
        }, 2000);
        refreshMenuItems();
        refreshCategory();
        resetUpload();
        setError(null);
      } catch (error) {
        const errorList = error.response.data;
        let displayMessage = '';
        for (let i = 0; i < errorList.length; i++) {
          const error = errorList[i];
          const errorKey = error.errorKey;
          if (errorKey == 'menuItem.nullSecretKey') {
            displayMessage = `${translate(errorKey)}`;
          } else {
            if (errorKey == 'menuItem.invalidSecretKey') {
              displayMessage = `${translate(errorKey)}`;
            } else {
              const contentKey = translate(error.contentKey);
              displayMessage += `${errorKey}: ${contentKey}\n`;
            }
          }
        }
        setError(<span style={{ whiteSpace: 'pre-line' }}>{displayMessage}</span>);
      }
    }
  };

  const refreshMenuItems = () => {
    dispatch(getEntities());
  };

  const refreshCategory = () => {
    dispatch(loadCategory({}));
  };

  //filter operation can do with tables
  if (pageable.isActive !== undefined) {
    if (pageable.isActive) items.splice(1, 1);
    else items.splice(2, 1);
  }

  useEffect(() => {
    dispatch(getEntities());
  }, [pageable]);

  useEffect(() => {
    dispatch(getEntities());
  }, [categoryUpdateSuccess]);

  useEffect(() => {
    if (selectedItems.length > 0 && updateSuccess) {
      setSelectedRowKeys([]);
      setSelectedItems([]);
    }
  }, [updateSuccess]);

  const handleOnchangePage = (page, pageSize) => {
    dispatch(setPageable({ ...pageable, page: page - 1, size: pageSize }));
  };

  const handleOnchangeSearch = e => {
    const search = e.target.value;
    if (search !== pageable.search) dispatch(setPageable({ ...pageable, page: 0, search }));
  };

  const handleOnchangeCategoryFilter = (checkedValues: CheckboxValueType[]) => {
    const isCheckAll = checkedValues.length === categoryList?.length;
    const selectedCategories = isCheckAll ? undefined : checkedValues.map(v => v.toString());
    dispatch(setPageable({ ...pageable, page: 0, category: selectedCategories }));
  };

  const handleOnchageStatusFilter = e => {
    dispatch(setPageable({ ...pageable, page: 0, isActive: e.target.value }));
  };

  const handleOpen = (item: IMenuItem) => {
    setUpdatingItem(item);
    setIsShowForm(true);
  };

  const handleClose = () => {
    setUpdatingItem(undefined);
    setIsShowForm(false);
  };

  const onSelectRow = ({ id }, selected) => {
    if (selected) setSelectedRowKeys(prev => [...prev, id]);
    else {
      const nextSelectedRowKeys = [...selectedRowKeys];
      const removeIndex = nextSelectedRowKeys.findIndex(k => k === id);
      nextSelectedRowKeys.splice(removeIndex, 1);
      setSelectedRowKeys(nextSelectedRowKeys);
    }
  };

  const onSelectAllRows = (selected: boolean, selectedRows: { id: any }[], changeRows: { id: any }[]) => {
    if (selected) {
      const changeRowKeys = selectedRows.filter(r => r).map(r => r.id);
      setSelectedRowKeys(prev => [...new Set([...prev, ...changeRowKeys])]);
    } else {
      const changeRowKeys = changeRows.map(r => r.id);
      setSelectedRowKeys(prev => prev.filter(k => !changeRowKeys.includes(k)));
    }
  };

  const handleDelete = () => {
    const nextSelectedItems = selectedRowKeys.map(key => {
      const m: IMenuItem = { id: key + '' };
      return m;
    });
    setSelectedItems(nextSelectedItems);
    setIsShowDialog(true);
  };

  const handleUpdateIsActive = (isActive: boolean) => {
    const nextSelectedItems = selectedRowKeys.map(key => {
      const m: IMenuItem = { id: key + '' };
      return m;
    });
    setSelectedItems(nextSelectedItems);
    setAllowSale(isActive);
    setIsShowDialog(true);
  };

  const handleResetSelectedRowKey = e => {
    e.preventDefault();
    setSelectedRowKeys([]);
  };

  const downloadTemplate = () => {
    const apiUrl = '/api/menu-items/download-template';
    axios({
      url: apiUrl,
      method: 'GET',
      responseType: 'blob',
    })
      .then(response => {
        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition?.match(/filename="(.+?)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : 'Menu-Item.xlsx';
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error during template download:', error);
      });
  };

  return (
    <>
      <MenuItemForm menuItem={updatingItem} handleClose={handleClose} isOpen={isShowForm} />
      <MenuItemDialog menuItems={selectedItems} handleClose={() => setIsShowDialog(false)} isOpen={isShowDialog} isActive={allowSale} />

      <Modal visible={isPopupVisible} onCancel={handleCancelPopup} footer={null}>
        <p>
          <div className="font-bold">
            <Translate contentKey={'menuItem.titleModalUpload'}></Translate>
          </div>
          <div>
            <Translate contentKey={'menuItem.contentDownload'}></Translate>
            <a onClick={downloadTemplate} download className="underline">
              <Translate contentKey={'menuItem.excelFile'}></Translate>
            </a>
            ).
          </div>
        </p>
        <div style={{ backgroundColor: '#f9f9e0', padding: '10px' }}>
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#7b5e2a' }}>
            <span style={{ fontWeight: 'bold' }}>
              <WarningOutlined style={{ marginRight: '0.5rem' }} rev={''} />
              <Translate contentKey={'menuItem.note'}></Translate>
            </span>
            <br />
            <Translate contentKey={'menuItem.dataValid'}></Translate>
            <br />
            <br />
            <Translate contentKey={'menuItem.specialCharacters'}></Translate>
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <div style={{ position: 'relative', marginRight: '10px' }}>
            <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} ref={fileInputRef} accept=".xlsx" />
            <div>
              <Button type="primary" onClick={() => fileInputRef.current.click()}>
                <Translate contentKey={'menuItem.selectFile'}></Translate>
              </Button>
            </div>
            {selectedFile && (
              <div>
                <div style={{ float: 'right' }}>
                  <p>{selectedFile.name}</p>
                </div>
                <div>
                  <Button type="primary" style={{ float: 'right' }} onClick={handleUpload}>
                    <Translate contentKey={'menuItem.upload'}></Translate>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      </Modal>

      <div className="flex h-full p-2">
        <div className="flex flex-col w-1/5 gap-4 p-4">
          <Card>
            <Typography.Title level={5}>
              <Translate contentKey="entity.action.find" />
            </Typography.Title>
            <Input placeholder={translate('menuItem.search.placeholder')} onPressEnter={handleOnchangeSearch} />
          </Card>
          <Card>
            <Typography.Title level={5}>
              <Translate contentKey="entity.label.status" />
            </Typography.Title>
            <Radio.Group className="flex flex-col gap-2" defaultValue={true} onChange={handleOnchageStatusFilter}>
              <Radio className="!font-normal" value={true}>
                <Translate contentKey="menuItem.status.trueValue" />
              </Radio>
              <Radio className="!font-normal" value={false}>
                <Translate contentKey="menuItem.status.falseValue" />
              </Radio>
              <Radio className="!font-normal" value={undefined}>
                <Translate contentKey="entity.label.all" />
              </Radio>
            </Radio.Group>
          </Card>
          <MenuItemCategoryCheckBoxes onFilter={handleOnchangeCategoryFilter} />
        </div>
        <div className="w-4/5 p-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Typography.Title level={3} className="!mb-0">
                  <Translate contentKey="menuItem.title" />
                </Typography.Title>
                {selectedRowKeys.length > 0 && (
                  <Tag className="px-4 py-1" closable color="blue" onClose={handleResetSelectedRowKey}>
                    <Translate contentKey="entity.action.select" interpolate={{ number: selectedRowKeys.length }} />
                  </Tag>
                )}
              </div>
              <div className="flex gap-2">
                <Dropdown menu={{ items }} disabled={selectedRowKeys.length === 0} className="!w-32">
                  <Button type="primary" icon={<BarsOutlined rev={''} />}>
                    <Translate contentKey="entity.label.operations" />
                  </Button>
                </Dropdown>
                <Button type="primary" icon={<PlusOutlined rev={''} />} onClick={() => setIsShowForm(true)}>
                  <Translate contentKey="menuItem.addNewLabel" />
                </Button>
                <Button type="primary" icon={<UploadOutlined rev={''} />} onClick={handleOpenPopup}>
                  <Translate contentKey="entity.action.import" />
                </Button>
              </div>
            </div>
            <Table
              columns={columns.map(c => ({ ...c, ellipsis: true }))}
              dataSource={menuItemList}
              pagination={{
                ...DEFAULT_PAGINATION_CONFIG,
                onChange: handleOnchangePage,
                total: count,
                current: pageable.page + 1,
                locale: { items_per_page: '/ ' + translate('global.table.pageText') },
              }}
              scroll={{ x: true }}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys,
                onSelect: onSelectRow,
                onSelectAll: onSelectAllRows,
              }}
              rowKey={'id'}
              rowClassName={'cursor-pointer'}
              loading={loading}
              expandable={{
                expandedRowRender: record => <MenuItemDetail menuItem={record} onUpdate={() => handleOpen(record)} />,
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
          </Card>
        </div>
      </div>
    </>
  );
};

export default MenuItem;
