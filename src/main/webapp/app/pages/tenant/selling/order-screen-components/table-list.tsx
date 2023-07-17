import React, { useEffect, useState } from 'react';
import { Card, Empty, Input, Radio, Segmented, Space, Typography } from 'antd';
import { ShoppingOutlined, TableOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getTableEntities } from 'app/pages/tenant/management/dining-table/dining-table.reducer';
import { getEntities as getZoneEntities } from 'app/pages/tenant/management/zone/zone.reducer';
import { Translate, translate } from 'react-jhipster';
import { IDiningTable } from 'app/shared/model/dining-table.model';
import TableIcon from 'app/shared/icons/table-icon';

export const TableList = () => {
  const dispatch = useAppDispatch();
  const tableList = useAppSelector(state => state.diningTable.entities);
  const zoneList = useAppSelector(state => state.zone.entities);

  useEffect(() => {
    dispatch(getTableEntities());
    dispatch(getZoneEntities({}));
  }, []);

  const [selectedTable, setSelectedTable] = useState(null);
  const handleTableClick = tableId => {
    setSelectedTable(tableId);
  };

  // const sortedDiningTableList = [...diningTableList].sort((a, b) => {
  //   if (a.name === 'Takeaway') {
  //     return -1;
  //   } else if (b.name === 'Takeaway') {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  // });

  return (
    <>
      <div className="shadow-sm">
        <div className="flex px-6 py-4 bg-white ">
          <Typography.Title level={3} className="!mb-0">
            TableView
          </Typography.Title>
        </div>
        <div className="flex gap-2 flex-col px-4 py-2 bg-white border-solid border-0 border-slate-200 border-t">
          <div className="flex !w-fit items-center justify-between p-0.5 bg-gray-100 rounded-md ">
            <Segmented options={[{ label: 'All', value: null }, ...zoneList.map(z => ({ label: z.name, value: z.id }))]} />
          </div>
          <div className="flex gap-12">
            <Input.Search allowClear enterButton className="w-60 " placeholder="Search table" />
            <Radio.Group className="flex gap-2 items-center" defaultValue={true} onChange={() => true}>
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
        </div>
      </div>
      <div className="h-screen py-6 px-8 rounded-bl-lg rounded-e-lg">
        <div id="table-list-wrapper" className="flex gap-6">
          {tableList.map(table => TableCard(table))}
        </div>
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
    </>
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
