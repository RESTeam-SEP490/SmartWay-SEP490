import React, { useEffect, useState } from 'react';
import { Button, Card, Empty, Input, Radio, Segmented, Space, Typography } from 'antd';
import { ShoppingOutlined, SyncOutlined, TableOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getTableEntities } from 'app/pages/tenant/management/dining-table/dining-table.reducer';
import { getEntities as getZoneEntities } from 'app/pages/tenant/management/zone/zone.reducer';
import { Translate, translate } from 'react-jhipster';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import TableIcon from 'app/shared/icons/table-icon';
import Scrollbars from 'react-custom-scrollbars-2';

export const TableList = () => {
  const dispatch = useAppDispatch();
  const tableList = useAppSelector(state => state.diningTable.entities);
  const zoneList = useAppSelector(state => state.zone.entities);

  const [filteredTableList, setFilteredTableList] = useState([]);
  const [filter, setFilter] = useState({ zoneId: '', isFree: undefined });

  useEffect(() => {
    dispatch(getTableEntities());
    dispatch(getZoneEntities({}));
  }, []);

  useEffect(() => {
    const { zoneId, isFree } = filter;
    let nextFilteredTableList: IDiningTable[] = [...tableList];
    if (zoneId?.length > 0) nextFilteredTableList = nextFilteredTableList.filter(table => table.zone.id === zoneId);
    if (isFree !== undefined) nextFilteredTableList = nextFilteredTableList.filter(table => table.isFree === isFree);
    setFilteredTableList(nextFilteredTableList);
  }, [filter, tableList]);

  const [selectedTable, setSelectedTable] = useState(null);
  const handleTableClick = tableId => {
    setSelectedTable(tableId);
  };

  return (
    <div className="p-2 bg-white h-[calc(100vh-66px)] flex flex-col rounded-se-lg rounded-b-lg">
      <div className="flex flex-col gap-4 py-4 px-2">
        <div className="flex justify-between items-center">
          <Segmented
            options={[{ label: 'All', value: '' }, ...zoneList.map(z => ({ label: z.name, value: z.id }))]}
            onChange={value => setFilter(prev => ({ ...prev, zoneId: value.toString() }))}
          />
          <Button
            size="large"
            icon={<SyncOutlined rev="" />}
            shape="circle"
            type="ghost"
            className="hover:!text-blue-600 !text-slate-600"
          ></Button>
        </div>
        <Radio.Group
          className="flex items-center gap-2 px-2"
          defaultValue={true}
          onChange={e => setFilter(prev => ({ ...prev, isFree: e.target.value }))}
        >
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
      </div>
      <Scrollbars className="grow rounded-md bg-gray-200">
        <div className="flex flex-wrap gap-4 m-4 ">{filteredTableList.map(table => TableCard(table))}</div>
      </Scrollbars>

      {/* {tableList.length > 0 ? (
        sortedDiningTableList.map(table => (
          <Card
            key={table.id}
            className={`square-card ${selectedTable === table.id ? 'selected' : ''}`}
            onClick={() => handleTableClick(table.id)}
          >
            <div className="flex-container table-item">
              <Space direction="vertical" align="center">
                {table.name === 'Takeaway' ? (
                  <ShoppingOutlined className="table-outlined-color" rev={undefined} />
                ) : (
                  <TableOutlined className="table-outlined-color" rev={undefined} />
                )}
                <Typography style={{ color: '#0066CC' }}>{table.name}</Typography>
              </Space>
            </div>
            </Card>
            ))
            ) : (
              <div className="empty-message">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
              </div>
            )} */}
    </div>
  );
};

const TableCard = (table: IDiningTable) => (
  <div
    key={table.id}
    className="flex flex-col items-center w-32 h-40 p-2 text-blue-600 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md"
  >
    <Typography.Text className="pb-4 font-semibold">{table.name}</Typography.Text>
    <TableIcon size={80} status={table.isFree ? 'available' : 'occupied'} />
  </div>
);

export default TableList;
