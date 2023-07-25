import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { BarsOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Input, MenuProps, Radio, Table, Tag, Typography } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import { ZoneCheckBoxes } from '../zone/zone';
import DiningTableDetail from './dining-table-detail';
import { DiningTableDialog } from './dining-table-dialog';
import DiningTableForm from './dining-table-form';
import { getEntities, setPageable } from './dining-table.reducer';
import { DEFAULT_PAGINATION_CONFIG } from '../../../../shared/util/pagination.constants';

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

  const diningTableList = useAppSelector(state => state.diningTable.entities);
  const pageable = useAppSelector(state => state.diningTable.pageable);
  const updateSuccess = useAppSelector(state => state.diningTable.updateSuccess);

  const zoneList = useAppSelector(state => state.zone.entities);
  const zoneUpdateSuccess = useAppSelector(state => state.zone.updateSuccess);
  const count = useAppSelector(state => state.diningTable.totalItems);
  const loading = useAppSelector(state => state.diningTable.loading);

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

  return (
    <>
      <DiningTableForm diningTable={updatingItem} handleClose={handleClose} isOpen={isShowForm} />
      <DiningTableDialog
        diningTables={selectedItems}
        handleClose={() => setIsShowDialog(false)}
        isOpen={isShowDialog}
        isActive={allowSale}
      />

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
                <Button type="primary" icon={<UploadOutlined rev={''} />}>
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
