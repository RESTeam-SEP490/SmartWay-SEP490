import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useRef, useState } from 'react';
import { translate, Translate } from 'react-jhipster';
import { IStaff } from 'app/shared/model/staff.model';
import { Button, Card, Dropdown, Empty, Input, MenuProps, message, Modal, Radio, Table, Tag, Typography } from 'antd';
import { DEFAULT_PAGINATION_CONFIG } from 'app/shared/util/pagination.constants';
import { getEntities, setPageable } from 'app/pages/tenant/management/staff/staff.reducer';
import { BarsOutlined, PlusOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';
import StaffForm from 'app/pages/tenant/management/staff/staff-form';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import StaffDetail from 'app/pages/tenant/management/staff/staff-detail';
import { RoleCheckBoxes } from 'app/pages/tenant/management/role/role-component';
import StaffDialog from 'app/pages/tenant/management/staff/staff-dialog';
import axios from 'axios';

export const Staff = () => {
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
          <Translate contentKey="staff.action.allowSell" />
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div onClick={() => handleUpdateIsActive(false)}>
          <Translate contentKey="staff.action.stopSell" />
        </div>
      ),
    },
  ];

  const columns = [
    { title: <Translate contentKey="staff.username.label" />, dataIndex: 'username', key: 'username' },
    { title: <Translate contentKey="staff.fullName.label" />, dataIndex: 'fullName', key: 'fullName' },
    { title: <Translate contentKey="staff.phone.label" />, dataIndex: 'phone', key: 'phone' },
    { title: <Translate contentKey="staff.email.label" />, dataIndex: 'email', key: 'email' },
    { title: <Translate contentKey="staff.role.label" />, dataIndex: ['role', 'name'], key: 'role' },
  ];

  const [expendedRow, setExpendedRow] = useState();

  const [isShowDialog, setIsShowDialog] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IStaff[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [allowSale, setAllowSale] = useState<boolean>();
  const [error, setError] = useState(null);
  const [isShowForm, setIsShowForm] = useState(false);
  const [updateStaff, setUpdateStaff] = useState<IStaff>();

  const staffList = useAppSelector(state => state.staff.entities);
  const pageable = useAppSelector(state => state.staff.pageable);
  const updateSuccess = useAppSelector(state => state.staff.updateSuccess);
  const fileInputRef = useRef(null);
  const roleList = useAppSelector(state => state.role.entities);
  const count = useAppSelector(state => state.staff.totalItems);
  const loading = useAppSelector(state => state.staff.loading);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    dispatch(getEntities());
  }, [pageable]);

  useEffect(() => {
    if (selectedItems.length > 0 && updateSuccess) {
      setSelectedRowKeys([]);
      setSelectedItems([]);
    }
  }, [updateSuccess]);

  const handleOnchangeStatusFilter = e => {
    dispatch(setPageable({ ...pageable, page: 0, isActive: e.target.value }));
  };

  const handleOnchangePage = (page, pageSize) => {
    dispatch(setPageable({ ...pageable, page: page - 1, size: pageSize }));
  };

  const handleOnchangeSearch = e => {
    const search = e.target.value;
    if (search !== pageable.search) dispatch(setPageable({ ...pageable, page: 0, search }));
  };

  const handleOnchangeRoleFilter = (checkedValues: CheckboxValueType[]) => {
    const isCheckAll = checkedValues.length === roleList?.length;
    const selectedRoles = isCheckAll ? undefined : checkedValues.map(v => v.toString());
    dispatch(setPageable({ ...pageable, page: 0, role: selectedRoles }));
  };

  const handleOpen = (staff: IStaff) => {
    setUpdateStaff(staff);
    setIsShowForm(true);
  };

  const handleClose = () => {
    setUpdateStaff(undefined);
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
      const s: IStaff = { id: key + '' };
      return s;
    });
    setSelectedItems(nextSelectedItems);
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

  const resetUpload = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
  };

  const downloadTemplate = () => {
    const apiUrl = '/api/staffs/download-template';
    axios({
      url: apiUrl,
      method: 'GET',
      responseType: 'blob',
    })
      .then(response => {
        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition?.match(/filename="(.+?)"/);
        const fileName = fileNameMatch ? fileNameMatch[1] : 'Staff.xlsx';
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

  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setError(
        <span style={{ color: 'red' }}>
          <Translate contentKey={'diningTable.fileInvalid'}></Translate>
        </span>
      );
    }
  };

  const refreshStaffs = () => {
    dispatch(getEntities());
  };

  const handleUpload = async () => {
    if (selectedFile) {
      console.log('Đã chọn tệp:', selectedFile);
      const formData = new FormData();
      fileInputRef.current.value = null;
      formData.append('file', selectedFile);
      try {
        const response = await axios.post('/api/staffs/import-staff', formData);
        setIsPopupVisible(false);
        setTimeout(() => {
          message.success(translate('diningTable.uploadSuccess'));
        }, 2000);
        refreshStaffs();
        resetUpload();
        setError(null);
      } catch (error) {
        const errorList = error.response.data;
        let displayMessage = '';
        for (let i = 0; i < errorList.length; i++) {
          const error = errorList[i];
          const errorKey = error.errorKey;
          if (errorKey == 'staff.nullSecretKey') {
            displayMessage = `${translate(errorKey)}`;
          } else {
            if (errorKey == 'staff.invalidSecretKey') {
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

  const handleUpdateIsActive = (isActive: boolean) => {
    const nextSelectedItems = selectedRowKeys.map(key => {
      const m: IStaff = { id: key + '' };
      return m;
    });
    setSelectedItems(nextSelectedItems);
    setAllowSale(isActive);
    setIsShowDialog(true);
  };

  return (
    <>
      <StaffForm staff={updateStaff} isOpen={isShowForm} handleClose={handleClose} />
      <StaffDialog staffs={selectedItems} isOpen={isShowDialog} handleClose={() => setIsShowDialog(false)} isActive={allowSale} />

      <Modal visible={isPopupVisible} onCancel={handleCancelPopup} footer={null}>
        <p>
          <div className="font-bold">
            <Translate contentKey={'staff.titleModalUpload'}></Translate>
          </div>
          <div>
            <Translate contentKey={'staff.contentDownload'}></Translate>
            <a onClick={downloadTemplate} download className="underline">
              <Translate contentKey={'staff.excelFile'}></Translate>
            </a>
            ).
          </div>
        </p>
        <div style={{ backgroundColor: '#f9f9e0', padding: '10px' }}>
          <p style={{ marginTop: '10px', fontStyle: 'italic', color: '#7b5e2a' }}>
            <span style={{ fontWeight: 'bold' }}>
              <WarningOutlined style={{ marginRight: '0.5rem' }} rev={''} />
              <Translate contentKey={'staff.note'}></Translate>
            </span>
            <br />
            <Translate contentKey={'staff.dataValid'}></Translate>
            <br />
            <br />
            <Translate contentKey={'staff.specialCharacters'}></Translate>
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <div style={{ position: 'relative', marginRight: '10px' }}>
            <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} ref={fileInputRef} accept=".xlsx" />
            <div>
              <Button type="primary" onClick={() => fileInputRef.current.click()}>
                <Translate contentKey={'staff.selectFile'}></Translate>
              </Button>
            </div>
            {selectedFile && (
              <div>
                <div style={{ float: 'right' }}>
                  <p>{selectedFile.name}</p>
                </div>
                <div>
                  <Button type="primary" style={{ float: 'right' }} onClick={handleUpload}>
                    <Translate contentKey={'staff.upload'}></Translate>
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
            <Input placeholder={translate('staff.search.placeholder')} onPressEnter={handleOnchangeSearch} />
          </Card>
          <Card>
            <Typography.Title level={5}>
              <Translate contentKey="entity.label.status" />
            </Typography.Title>
            <Radio.Group className="flex flex-col gap-2" defaultValue={true} onChange={handleOnchangeStatusFilter}>
              <Radio className="!font-normal" value={true}>
                <Translate contentKey="staff.status.trueValue" />
              </Radio>
              <Radio className="!font-normal" value={false}>
                <Translate contentKey="staff.status.falseValue" />
              </Radio>
              <Radio className="!font-normal" value={undefined}>
                <Translate contentKey="entity.label.all" />
              </Radio>
            </Radio.Group>
          </Card>
          <RoleCheckBoxes onFilter={handleOnchangeRoleFilter} />
        </div>
        <div className="w-4/5 p-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Typography.Title level={3} className="!mb-0">
                  <Translate contentKey="staff.title" />
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
                  <Translate contentKey="staff.addNewLabel" />
                </Button>

                <Button type="primary" icon={<UploadOutlined rev={''} />} onClick={handleOpenPopup}>
                  <Translate contentKey="entity.action.import" />
                </Button>
              </div>
            </div>

            <Table
              columns={columns.map(s => ({ ...s, ellipsis: true }))}
              dataSource={staffList}
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
                expandedRowRender: record => <StaffDetail staff={record} onUpdate={() => handleOpen(record)} />,
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
