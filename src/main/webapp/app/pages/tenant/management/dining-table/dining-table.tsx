import React, { useEffect, useRef, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { BarsOutlined, PlusOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Input, MenuProps, message, Modal, Radio, Table, Tag, Typography } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import { ZoneCheckBoxes } from '../zone/zone';
import DiningTableDetail from './dining-table-detail';
import { DiningTableDialog } from './dining-table-dialog';
import DiningTableForm from './dining-table-form';
import { getEntities, setPageable } from './dining-table.reducer';
import { getEntities as getZone } from '../zone/zone.reducer';
import { DEFAULT_PAGINATION_CONFIG } from '../../../../shared/util/pagination.constants';
import axios from 'axios';

export const DiningTable = () => {
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
          <Translate contentKey="diningTable.action.allowSell" />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={() => handleUpdateIsActive(false)}>
          <Translate contentKey="diningTable.action.stopSell" />
        </div>
      ),
    },
  ];

  const columns = [
    { title: <Translate contentKey="diningTable.name.label" />, dataIndex: 'name', key: 'name' },
    {
      title: <Translate contentKey="diningTable.numberOfSeat.label" />,
      dataIndex: 'numberOfSeats',
      key: 'numberOfSeats',
      render: numberOfSeats => (numberOfSeats !== 0 ? numberOfSeats : <Translate contentKey="diningTable.message.seat" />),
    },

    {
      title: <Translate contentKey="diningTable.zone.label" />,
      dataIndex: ['zone', 'name'],
      key: 'zone',
      render: zone => (zone !== undefined ? zone : <Translate contentKey="diningTable.message" />),
    },
    {
      title: <Translate contentKey="diningTable.status.label" />,
      dataIndex: 'isActive',
      key: 'isActive',
      render: (i: boolean) => <Translate contentKey={i ? 'diningTable.status.trueValue' : 'diningTable.status.falseValue'} />,
    },
  ];

  const [expendedRow, setExpendedRow] = useState();
  const [isShowDialog, setIsShowDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IDiningTable[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [allowSale, setAllowSale] = useState<boolean>();
  const [isShowForm, setIsShowForm] = useState(false);
  const [updatingItem, setUpdatingItem] = useState<IDiningTable>();
  const fileInputRef = useRef(null);
  const diningTableList = useAppSelector(state => state.diningTable.entities);
  const pageable = useAppSelector(state => state.diningTable.pageable);
  const updateSuccess = useAppSelector(state => state.diningTable.updateSuccess);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const zoneList = useAppSelector(state => state.zone.entities);
  const zoneUpdateSuccess = useAppSelector(state => state.zone.updateSuccess);
  const count = useAppSelector(state => state.diningTable.totalItems);
  const loading = useAppSelector(state => state.diningTable.loading);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  if (pageable.isActive !== undefined) {
    if (pageable.isActive) items.splice(1, 1);
    else items.splice(2, 1);
  }

  useEffect(() => {
    dispatch(getEntities());
  }, [pageable]);

  useEffect(() => {
    dispatch(getEntities());
  }, [zoneUpdateSuccess]);

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

  const handleOnchangeZoneFilter = (checkedValues: CheckboxValueType[]) => {
    const isCheckAll = checkedValues.length === zoneList?.length;
    const selectedZones = isCheckAll ? undefined : checkedValues.map(v => v.toString());
    dispatch(setPageable({ ...pageable, page: 0, zone: selectedZones }));
  };

  const handleOnchageStatusFilter = e => {
    dispatch(setPageable({ ...pageable, page: 0, isActive: e.target.value }));
  };

  const handleOpen = (item: IDiningTable) => {
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
      const m: IDiningTable = { id: key + '' };
      return m;
    });
    setSelectedItems(nextSelectedItems);
    setIsShowDialog(true);
  };

  const handleUpdateIsActive = (isActive: boolean) => {
    const nextSelectedItems = selectedRowKeys.map(key => {
      const m: IDiningTable = { id: key + '' };
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

  const handleOpenPopup = () => {
    setIsPopupVisible(true);
  };

  const handleCancelPopup = () => {
    setIsPopupVisible(false);
    resetUpload();
    setError(null);
  };

  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      if (file.name === 'Table.xlsx') {
        setSelectedFile(file);
        setError(null);
      } else {
        setSelectedFile(null);
        setError(
          <span style={{ color: 'red' }}>
            <Translate contentKey={'diningTable.fileInvalidName'}></Translate>
          </span>
        );
      }
    } else {
      setSelectedFile(null);
      setError(
        <span style={{ color: 'red' }}>
          <Translate contentKey={'diningTable.fileInvalid'}></Translate>
        </span>
      );
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  const refreshMenuItems = () => {
    dispatch(getEntities());
  };

  const refreshZone = () => {
    dispatch(getZone({}));
  };

  const handleUpload = async () => {
    if (selectedFile) {
      console.log('Đã chọn tệp:', selectedFile);
      const formData = new FormData();
      fileInputRef.current.value = null;
      formData.append('file', selectedFile);
      try {
        const response = await axios.post('/api/dining_tables/import-table', formData);
        setIsPopupVisible(false);
        setTimeout(() => {
          message.success(translate('diningTable.uploadSuccess'));
        }, 2000);
        refreshMenuItems();
        refreshZone();
        resetUpload();
        setError(null);
      } catch (error) {
        const errorList = error.response.data;
        let displayMessage = '';
        for (let i = 0; i < errorList.length; i++) {
          const error = errorList[i];
          const errorKey = error.errorKey;
          if (errorKey == 'Sheet name') {
            const contentKey = translate(error.contentKey);
            displayMessage += `${translate(errorKey)}: ${contentKey}\n`;
          } else {
            const contentKey = translate(error.contentKey);
            displayMessage += `${errorKey}: ${contentKey}\n`;
          }
        }
        setError(<span style={{ whiteSpace: 'pre-line' }}>{displayMessage}</span>);
      }
    }
  };

  const downloadTemplate = () => {
    const apiUrl = '/api/dining_tables/download-template';
    axios({
      url: apiUrl,
      method: 'GET',
      responseType: 'blob',
    })
      .then(response => {
        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition?.match(/filename="(.+?)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : 'Table.xlsx';
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
      <DiningTableForm diningTable={updatingItem} handleClose={handleClose} isOpen={isShowForm} />
      <DiningTableDialog
        diningTables={selectedItems}
        handleClose={() => setIsShowDialog(false)}
        isOpen={isShowDialog}
        isActive={allowSale}
      />

      <Modal visible={isPopupVisible} onCancel={handleCancelPopup} footer={null}>
        <p>
          <p>
            <div className="font-bold">
              <Translate contentKey={'diningTable.titleModalUpload'}></Translate>
            </div>
            <div>
              <Translate contentKey={'diningTable.contentDownload'}></Translate>
              <a onClick={downloadTemplate} download className="underline">
                <Translate contentKey={'diningTable.excelFile'}></Translate>
              </a>
              ).
            </div>
          </p>
        </p>
        <div style={{ backgroundColor: '#f9f9e0', padding: '10px' }}>
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#7b5e2a' }}>
            <span style={{ fontWeight: 'bold' }}>
              <WarningOutlined style={{ marginRight: '0.5rem' }} rev={''} />
              <Translate contentKey={'diningTable.note'}></Translate>
            </span>
            <br />
            <Translate contentKey={'diningTable.dataValid'}></Translate>
            <br />
            <br />
            <Translate contentKey={'diningTable.specialCharacters'}></Translate>
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <div style={{ position: 'relative', marginRight: '10px' }}>
            <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} ref={fileInputRef} accept=".xlsx" />
            <div>
              <Button type="primary" onClick={() => fileInputRef.current.click()}>
                <Translate contentKey={'diningTable.selectFile'}></Translate>
              </Button>
            </div>
            {selectedFile && (
              <div>
                <div style={{ float: 'right' }}>
                  <p>{selectedFile.name}</p>
                </div>
                <div>
                  <Button type="primary" style={{ float: 'right' }} onClick={handleUpload}>
                    <Translate contentKey={'diningTable.upload'}></Translate>
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
            <Input placeholder={translate('diningTable.search.placeholder')} onPressEnter={handleOnchangeSearch} />
          </Card>
          <Card>
            <Typography.Title level={5}>
              <Translate contentKey="entity.label.status" />
            </Typography.Title>
            <Radio.Group className="flex flex-col gap-2" defaultValue={true} onChange={handleOnchageStatusFilter}>
              <Radio className="!font-normal" value={true}>
                <Translate contentKey="diningTable.status.trueValue" />
              </Radio>
              <Radio className="!font-normal" value={false}>
                <Translate contentKey="diningTable.status.falseValue" />
              </Radio>
              <Radio className="!font-normal" value={undefined}>
                <Translate contentKey="entity.label.all" />
              </Radio>
            </Radio.Group>
          </Card>
          <ZoneCheckBoxes onFilter={handleOnchangeZoneFilter} />
        </div>
        <div className="w-4/5 p-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Typography.Title level={3} className="!mb-0">
                  <Translate contentKey="diningTable.title" />
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
                  <Translate contentKey="diningTable.addNewLabel" />
                </Button>
                <Button type="primary" icon={<UploadOutlined rev={''} />} onClick={handleOpenPopup}>
                  <Translate contentKey="entity.action.import" />
                </Button>
              </div>
            </div>
            <Table
              columns={columns.map(c => ({ ...c, ellipsis: true }))}
              dataSource={diningTableList}
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
                expandedRowRender: record => <DiningTableDetail diningTable={record} onUpdate={() => handleOpen(record)} />,
                expandedRowClassName: () => '!bg-white',
                expandRowByClick: true,
                expandIcon: () => <></>,
                expandedRowKeys: [expendedRow],
                onExpand(expended, record) {
                  if (expended) setExpendedRow(record.id);
                  else setExpendedRow(undefined);
                },
              }}
            ></Table>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DiningTable;
